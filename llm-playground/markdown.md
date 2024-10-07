# Introduction

Il s'agit d'un retour sur les premiers développements de VApp, une application qui tente de répondre, à l'aide de la GenAI, au besoin d'identifier rapidement et sans grandes compétences techniques l'éligibilité des aides pour un projet.

# Raison de certains choix technique

Le code associé à chaque partie sera détaillé plus bas dans le document Markdown/Jupyter.

Nous nous appuyons principalement sur l'API d'Aide Territoire pour constituer la base de données d'maide. Cette API représente en effet une première source fiable et régulièrement mise à jour concernant les subventions pour les collectivités.

Nous avons également évoqué la possibilité d'interroger les formulaires d'aide de Démarches Simplifiées, mais cela présente un défi de taille. En effet, toutes les aides ne sont pas centralisées sur Démarches Simplifiées.

J'ai imaginé l'application autour de trois composantes principales :
- Frontend
- Backend
- Serveur GPU dédié à la partie LLM et à l'IA de manière plus générale
Je vais détailler le choix de chacune de ces solutions par la suite. Pour résumé :

Dans le cadre de la création d'une application web basée sur l'intelligence artificielle, j'ai choisi de structurer l'architecture de manière modulaire en séparant clairement le frontend, le backend et un serveur GPU dédié aux tâches liées à l'IA. L'objectif principal derrière cette approche est d'optimiser les performances et de garantir une meilleure gestion des ressources.

En effet, les GPU sont essentiels pour accélérer les calculs massivement parallèles, caractéristiques des modèles d'apprentissage automatique et des réseaux neuronaux complexes. Ces derniers nécessitent de traiter de grandes quantités de données en simultané, ce qui rend les GPU bien plus efficaces que les CPU pour ces types de tâches. En déployant un serveur spécifique aux calculs IA, je m'assure que l'inférence et l'entraînement des modèles de type LLM se déroulent de manière fluide, sans ralentir le reste de l'application.

Ce découplage permet également d'améliorer la scalabilité. Si les besoins en calcul augmentent, il est possible d'ajouter davantage de ressources GPU sans impacter la performance du frontend ou du backend. Cela réduit les risques de goulots d'étranglement et offre une meilleure flexibilité en termes d'évolutivité. Par ailleurs, cette architecture permet de mieux contrôler les coûts en allouant des ressources puissantes là où elles sont vraiment nécessaires, tout en maintenant une infrastructure classique pour les autres composants de l'application​.

En conclusion, cette séparation claire entre les différentes couches de l'application et l'utilisation d'un serveur dédié aux calculs IA garantit non seulement des performances optimales, mais aussi une flexibilité et une évolutivité accrues, essentielles pour l'évolution future du projet.

## Frontend
Le choix du frontend a été relativement simple. Je travaillais initialement avec Python Flask en backend, et j'utilisais directement le combo HTML/CSS/JS. Ensuite, j'ai voulu implémenter des fonctionnalités plus complexes et plus dynamiques, et j'ai hésité entre Angular et React.

La communauté beta.gouv utilisant principalement React et proposant déjà un template React DFSR, mon choix s'est orienté vers cette solution.

## Backend
Initialement sur Flask, je suis rapidement passé à Django. Django est un framework Python avec une communauté déjà importante chez beta.gouv. De plus, il semblait plus adapté pour créer un backend sous forme d'API, ce qui permettrait une intégration plus simple à long terme avec Aide Territoire ou Mon Espace Collectivité, selon moi.

Je souhaitais également rester sur un framework Python, car cela simplifie grandement les interactions avec les LLM, quelle que soit l'approche adoptée par la suite.

## Serveur GPU - IA
Pour le serveur GPU IA j'ai préféré partir sur une solution très low level, pour plusieurs raison :
- Des application comme ollama permette une interaction et un déploiement extraimeent simple sous forme d'API à un large panel de LLM
- Permet de facilement avoir accès à de la ressoure GPU qui est reconnue pour faciliter l'usage de large réseau neuronaux.
- Pour le moment le problème va être brute force à l'aide de LLM mais il sera envisagble de a termes créer des réseau de neurone dédié à la tache beaucoup plus éfficace et ne nécessitant pas de autant de ressoure. Le serveur dédié facilitera le protoypage de ces solutions.
- Dans notre contexte nous aurions pu utiliser des api tel que celle d'open IA ou de mistral, cependant nous voulons pouvoir tester rapidement une large variété de model open source pour trouver celui le plus adapter à la tache, quit à employer également une compinéaison d'autre méthode. Nous avons également pour ojbectif de montrer la faisablité d'utiliser des modèles customes sur des serveur spécialisé pour mettre en évidence où non la néssésité à plus long terme de se dauter de serveur dédié GenIA au seins des ministères.

### Usage de la solution Ollama
Je souhaite utiliser Ollama (https://ollama.com/) pour la gestion des LLM, car il permet une gestion extrêmement simplifiée des modèles via une API, tout en offrant la possibilité d'ajuster très finement les modèles pour des utilisations spécialisées.

Il intègre également plusieurs méthodes d'optimisation, notamment la quantization, ce qui permet de réduire considérablement l'utilisation des ressources serveur.

Enfin, je pense qu'il n'est pas nécessaire de nous concentrer sur l'optimisation ultime des appels aux LLM pour le moment, car cela pourra être pris en compte plus tard dans une application à plus grande échelle, produite par l'État. De plus, nous pouvons facilement faire évoluer les instances d'Ollama directement via le backend de notre application (par exemple, en prévoyant une gestion de la charge qui ouvre ou ferme des instances Ollama en fonction des besoins).

```python
# Import des libraires
import requests
import pandas as pd
import numpy as np
import json
import os
```

```python
# Creation d'une classe pour dialoguer plus simplement avec l'API de AT
class APIClient:
    def __init__(self,x_auth_token):
        self.x_auth_token = x_auth_token
        self.base_uri = self.get_api_base_url()
        self.bearer_token = self.get_bearer_token()
        self.session = self.create_session() 

    def get_api_base_url(self):
        return 'https://aides-territoires.beta.gouv.fr/api/'

    def get_bearer_token(self):
        url = 'https://aides-territoires.beta.gouv.fr/api/connexion/'
        headers = {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'X-AUTH-TOKEN': self.x_auth_token
        }
        response = requests.post(url, headers=headers)
        response.raise_for_status()
        return response.json()['token']

    def create_session(self):
        session = requests.Session()
        session.headers.update({
            'Authorization': f'Bearer {self.bearer_token}',
            'Accept': 'application/json'
        })
        return session

    def simple_request_endpoint(self, endpoint, method='GET'):
        url = f'{self.base_uri}{endpoint}'
        response = self.session.request(method, url)
        response.raise_for_status()
        return response

    def simple_request_url(self, url, method='GET'):
        response = self.session.request(method, url)
        response.raise_for_status()
        return response
    
# Utilisation vous avez besoin d'un x_auth_token fournit par aide territoires
client = APIClient(x_auth_token)
```

Je collecte l'ensemble des données de toutes les aides d'Aide Territoire (AT) que je stocke dans une liste, afin de pouvoir ensuite les convertir en Pandas DataFrame et les enregistrer en local. Je procède ainsi pour plusieurs raisons (tout en sachant pertinemment que l'idéal serait d'avoir notre propre base de données) :

- La base de données n'est pas très volumineuse, environ 50 Mo tout au plus.
- Le LLM représente la plus grande part du temps de réponse. Cependant, durant la phase de prototypage, nous préférons éviter les problèmes de latence et l'instabilité potentielle liée à l'API d'AT.
- Stocker les données dans un Pandas DataFrame permet de visualiser rapidement et de manière exhaustive le contenu de la base de données.

```python
response = client.simple_request_endpoint('aids/?page=1&itemsPerPage=30')
data = response.json()
data_collect = data['results']
error_counter = 0
while data['next'] or error_counter >10:
    try:
        url = data['next']
        print(url)
        response = client.simple_request_url(url)
        data = response.json()
        data_collect = data_collect + data['results']
        error_counter = 0
    except Exception as error:
        print(error)
        error_counter += 1

data_at = pd.DataFrame(data_collect)
```
Pour l'utilisation de la base de données, nous avons remarqué qu'un grand nombre d'aides contiennent moins de 3 000 caractères (environ 500 mots). Cela représente 90 % de la base, mais pour garantir l'efficacité de l'outil, nous avons préféré les exclure et ne conserver que les aides les mieux décrites, soit un total de ~ 400.

```python
data_at_select = data_at[['id','name','description','eligibility','project_examples']].dropna(subset='description')

sub_min_description = 3000

data_at_select = data_at_select[data_at_select['description'].apply(len)>sub_min_description].reset_index(drop=True)
```
# Usage du LLM

## Usage 1 - Attribution d'un score en fonction d'une aide et de la description d'un projet

Ici, nous sommes grandement contraints par les limites techniques propres aux LLM. Voici les principales raisons de mon approche :
- Les aides contiennent entre 500 et 10 000 mots, soit environ 250 à 5 000 tokens. Les LLM ayant une capacité limitée à gérer le contexte (et plus le contexte est long, moins ils sont fiables), j'ai préféré limiter chaque appel à une seule aide et à une description de projet.
- Cette approche est similaire à d'autres méthodes déjà connues avec les LLM.
- Le RAG, qui repose sur une analyse vectorielle des embeddings pour mesurer la similarité probabiliste entre une requête et des documents, semblait initialement prometteur. Cependant, nous l'avons écarté après réflexion. Lors d'une discussion sur une solution sans RAG, des aides apparemment non reliées à un projet spécifique ont émergé. Cela s'est révélé pertinent après avoir consulté une chargée d'affaires qui a confirmé que certains projets peuvent comporter des aspects complexes où des aides moins évidentes (comme l’aménagement d’étangs pour un projet de réfection de voirie) deviennent cruciales pour la réussite globale du projet. Ce genre de subtilité pourrait échapper à une approche purement vectorielle du RAG.
- Nous avons observé une variabilité dans les réponses des LLM en fonction des seeds (ou aléas initiaux). Pour garantir une réponse cohérente et fiable, nous appliquons une méthode de bouclage inspirée de la technique MMLU (Massive Multitask Language Understanding). Chaque aide se voit attribuer un score basé sur une moyenne des résultats sur plusieurs itérations, ce qui permet de lisser les fluctuations liées à la génération probabiliste des modèles.

### Variable env
Ci-dessous se trouve le prompt système, qui définit le retour attendu. Ce prompt pourrait également être ajouté hors du prompt système, à la fin du prompt principal, mais j'ai pour l'instant privilégié cette approche. En effet, les derniers modèles, tels que Mistral, NeMo et LLaMA 3.1, ont démontré une bonne capacité à conserver le contexte du prompt système, même dans des contextes longs.

```python
prompt_system = """Tu aides l'utilisateur à déterminer la compatibilité de l'aide ou subvention à analyser par rapport à la description de son projet.
Réponds uniquement par un chiffre de 1 à 5.
- Attribue 5 si l'aide ou la subvention correspond parfaitement aux objectifs et aux besoins du projet. 
  - Les objectifs de l'aide/subvention sont totalement alignés avec les besoins du projet.
  - Les conditions et exigences de l'aide/subvention sont complètement satisfaites par le projet.
- Attribue 4 si l'aide ou la subvention correspond très bien aux objectifs et aux besoins du projet. 
  - Les objectifs de l'aide/subvention sont majoritairement alignés avec les besoins du projet.
  - La plupart des conditions et exigences de l'aide/subvention sont satisfaites par le projet.
- Attribue 3 si l'aide ou la subvention correspond partiellement aux objectifs et aux besoins du projet.
  - Les objectifs de l'aide/subvention sont partiellement alignés avec les besoins du projet.
  - Certaines conditions et exigences de l'aide/subvention sont satisfaites par le projet.
- Attribue 2 si l'aide ou la subvention a une correspondance minimale avec les objectifs et les besoins du projet.
  - Les objectifs de l'aide/subvention sont rarement alignés avec les besoins du projet.
  - Peu de conditions et exigences de l'aide/subvention sont satisfaites par le projet.
- Attribue 1 si la description du projet n'est pas suffisamment détaillée ou est trop vague, ou si l'aide ou la subvention n'a aucune correspondance avec les objectifs et les besoins du projet.
  - Les objectifs de l'aide/subvention ne sont pas du tout alignés avec les besoins du projet.
  - Aucune des conditions et exigences de l'aide/subvention n'est satisfaite par le projet.

Si un élément ou paragraphe spécifique de l'aide ou subvention semble correspondre aux besoins du projet, utilise cette information pour attribuer la note en conséquence.
Ne donne aucune explication, aucun autre mot ou phrase, juste un des chiffres indiqués ci-dessus.
Réponds exclusivement par un chiffre unique entre 1 et 5, sans aucun texte supplémentaire."""

model = "mistral-nemo:12b-instruct-2407-q8_0"

top_k = 20
top_p = 0.9
temperature = 0.2 # 0.8 if you use another model than mistral nemo
repeat_penalty = 1.2 # there can be a lot of repeat word in a subvention so this parameter can be adjusted to help the model but keep in mind that it's a tricky one
presence_penalty = 1.5
frequency_penalty = 1.0 
num_ctx = 16384
num_predict = 32 # we basicly ask the model to predict a number between 1 and 5. By using a small num_predict we ensure that we don't allow it to

ollama_url = "OLLAMA_API_URL"
api_url = ollama_url+"/api/generate"
```

### Variabe d'une requette post
variables attendues envoyées par le client

```python
seed_number =5 

data = request.data
sub_id = data['sub_id']
project_description = data['user_project_initial_description']
seed_number = data['seed_number']
```

### Exemple en python

```python
prompt_user = f"*Aide ou subvention à analyser :*\n{sub}\n\n____\n*Projet de l'utilisateur :*\n{project_description}"

sub = dbm.format_sub(sub_id) #dbm is supposed to be the database of sub extract from aides terrtoires
sub_data = dbm.main_info_field(sub_id)

headers = {'Content-Type': 'application/json'}

subvention_score = 0

for seed in range(seed_number):
    data = {
        "model": model,
        "system": prompt_system ,
        "prompt": prompt_user,
        "stream": False,
        "options": {
            "seed": seed,
            "top_k": top_k,
            "top_p": top_p,
            "temperature": temperature,
            "repeat_penalty": repeat_penalty,
            "presence_penalty": presence_penalty,
            "frequency_penalty": frequency_penalty,
            "num_ctx": num_ctx,
            "num_predict":num_predict
            }
            }
    try:
        response = requests.post(api_url, data=json.dumps(data), headers=headers)
    except Exception as error:
        print('-----------------------------------------')
        print('Sommething went wrong')
        print(error)
    try :
        subvention_score += int(response.json()['response'])
    except Exception as error:
        print('-----------------------------------------')
        print('llm awnser not with the excepted format')
        print(response.json()['response'])
response = {'subvention_score':subvention_score,'sub_score_ratio':subvention_score/(seed_number*5),'sub_title':dbm.database.loc[sub_id]['name']}

response = response | sub_data
```

## Usage 2 - Questionner sur une aide pour en améliorer l'éligibilité

A FAIRE