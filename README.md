# VApp

![GitHub last commit (branch)](https://img.shields.io/github/last-commit/betagouv/template/main)  
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/betagouv/template)

**VApp** permet de simplifier la recherche d'aide et l'applicabilité des projets portés par les collectivités.

> Voir la [présentation du projet VApp](https://beta.gouv.fr/startups/vapp.html)

Il est composé d'un _bac à sable_ : une UI minimaliste permettant d'effectuer directement une recherche d'aide.

> Ce _sandbox_ a vocation à disparaître.

D'une _API_, constituant le cœur du projet, permettant d'effectuer des scoring d'aides en fonction d'un projet.

> Voir l'explication détaillée du fonctionnement sur la [documentation dédiée à l'API](https://betagouv.github.io/VApp/).

## Développement

Créer un fichier `.env` basé sur `.env.development` :

```sh
cp .env.development .env
```

Lancer le conteneur de BDD :

```sh
docker compose up
```

Installer les dépendances et lancer l'app :

```sh
yarn # to install dependencies
yarn dev # to run in dev mode
```

Ouvrir la page d'accueil [http://127.0.0.1:3000/](http://127.0.0.1:3000/template) et commencer à tester.

### Storybook

> Use React DSFR Storybook :  
> https://components.react-dsfr.codegouv.studio

### Migrations

Pour les modifications de BDD :

Créer le fichier de migration et compléter le `up` et le `down` :

```sh
yarn kysely migrate make MIGRATION_NAME
```

Exécuter la migration et mettre les types :

```sh
yarn kysely migrate latest
yarn kysely-codegen
```

## Tests

```sh
# run unit tests with vitest
yarn test
```

```sh
# run storybook
yarn storybook
```

```sh
docker compose --env-file .env.test up

# build, serve and launch playwright interactive end-to-end tests
yarn e2e --ui
```

## Ollama

Follow production logs:

```sh
journalctl -u ollama.service -f
```

Watch GPU usage:

```sh
watch -n 1 nvidia-smi
```

Pull a model:

```sh
curl http://localhost:11434/api/pull -d '{"model": "mistral-small:latest"}'
```

## AT

Get token:

```sh
curl -X 'GET' \
  'https://aides-territoires.beta.gouv.fr/api/connexion' \
  -H 'accept: application/ld+json' \
  -H 'X-AUTH-TOKEN: myAidesTerritoiresToken'
```

## Prompts

> _Se référer au [dossier des prompts](./src/infra/ai/prompts/)._

## Infrastructure

> _Voir [Documentation des Services d'IA Externes](./external-ai-services/)._

## Architecture Decision Records

> _Voir [decisions](./decisions/)._

## Projets connexes

- https://github.com/MTES-MCT/aides-territoires
- https://github.com/betagouv/mon-espace-collectivite
- https://github.com/betagouv/communs-de-la-transition-ecologique-des-collectivites

## Resources

- https://jsonapi.org/recommendations/#asynchronous-processing
