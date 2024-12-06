#!/bin/bash

# Mettre à jour les paquets et mettre à niveau le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
sudo apt install docker.io -y

# Installer NVIDIA container toolkit pour Docker (si ce n'est pas déjà fait)
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
sudo apt-get install -y nvidia-container-toolkit
sudo systemctl restart docker

# Installer Ollama via Docker
docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama


# Installer OpenWebUI via Docker avec un compte admin par défaut
docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway \
    -v open-webui:/app/backend/data --name open-webui --restart always \
    ghcr.io/open-webui/open-webui:cuda

# Attendre quelques secondes pour s'assurer que les conteneurs démarrent
sleep 5

# Installer Nginx
sudo apt update && sudo apt install nginx -y

# Configurer Nginx pour rediriger vers Ollama et OpenWebUI
IP=$(hostname -I | awk '{print $1}')
TOKEN=$BEARER_TOKEN

cat <<EOL | sudo tee /etc/nginx/sites-available/ollama_openwebui
upstream ollama {
    server localhost:11434;
}

upstream openwebui {
    server localhost:3000;
}

server {
    listen 80;
    server_name ${IP};

    location /ollama/ {
        # Check if the Authorization header is present and has the correct Bearer token / API Key
        set \$token "Bearer $TOKEN";
        if (\$http_authorization != \$token) {
            return 401 "Unauthorized";
        }

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Forward request to the actual Ollama service
        proxy_pass http://ollama;
    }

    location /openwebui/ {
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Forward request to the actual OpenWebUI service
        proxy_pass http://openwebui;
    }
}
EOL

# Activer la configuration Nginx
sudo ln -s /etc/nginx/sites-available/ollama_openwebui /etc/nginx/sites-enabled/

# Redémarrer Nginx pour appliquer les changements
sudo systemctl restart nginx