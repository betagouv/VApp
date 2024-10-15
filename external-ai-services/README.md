# Documentation des Services d'IA Externes

Ce répertoire contient tous les documents relatifs à l'infrastructure externe de l'intelligence artificielle (IA) utilisée par notre application. Cela inclut des scripts, des configurations et des informations utiles pour déployer et gérer le serveur IA.

## Solution

Pour l'utilisation de VApp, nous avons opté pour un serveur externe exécutant Ollama ([https://github.com/ollama/ollama](#)). Cette solution offre une grande liberté dans le choix des modèles et propose déjà une large gamme de modèles avec diverses méthodes d'optimisation. L'accès via une API assure également une flexibilité certaine en cas d'intégration plus large à l'avenir. Pour plus d’informations, consultez la racine du dépôt ([ajouter lien](#)).

Nous avons externalisé cette ressource via des serveurs externes. Le répertoire ci-dessous propose une solution simple, automatisée et répliquable pour démarrer une instance.

## Structure du Répertoire

- **setup/** : Setup basique avec le support d'un systeme de token d'authentication
    - `setup.sh` : Script principal pour installer et configurer l'environnement Nginx et Ollama.
- **setup-openwebui/** : Setup avec le support de openwebui
    - `setup.sh` : Script principal pour installer et configurer l'environnement Nginx, Ollama et Open WebUI. **(work in progress)**
- **setup-no-nginx/** : Setup sans nginx et sans token d'authentication
    - `setup.sh` : Script principal pour installer et configurer l'environnement Ollama.
- `cloud-init.yaml` : Script principal pour installer et configurer automatiquement une instance. **(work in progress)**

## Étapes de Configuration

### Installation avec cloud-init

```bash
wget https://raw.githubusercontent.com/your-repo/path/cloud-init.yaml -O /tmp/cloud-init.yaml
```

### Installation en directe

Vous pouvez installer le script via la commande suivante avec une configuration **avec token d'authentication**.

```bash
export BEARER_TOKEN="YOUR_TOKEN"
echo $BEARER_TOKEN
chmod +x /path/to/setup.sh
sudo bash -c "export BEARER_TOKEN=$BEARER_TOKEN; /path/to/setup.sh"
```

___

Vous pouvez installer le script via la commande suivante avec une configuration **sans token d'authentication**.

```bash
chmod +x /path/to/setup.sh
sudo bash -c "/path/to/setup.sh"
```

## Simple test

<p>Pour vous assurer que tout fonctionne correctement, vous pouvez réaliser les tests suivants</p>

```bash
curl -X POST http://YOUR_INSTANCE_IP/api/generate -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" -d '{"model": "llama3.2:1b", "prompt": "Why is the sky blue?", "stream": false}'
```
   