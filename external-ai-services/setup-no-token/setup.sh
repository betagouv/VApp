#!/bin/bash

# Mettre à jour les paquets et mettre à niveau le système sans interaction
sudo DEBIAN_FRONTEND=noninteractive apt update && sudo DEBIAN_FRONTEND=noninteractive apt upgrade -y

# Installer CUDA Toolkit pour NVIDIA sans interaction
sudo DEBIAN_FRONTEND=noninteractive apt install nvidia-cuda-toolkit -y

# Télécharger et installer Ollama
curl -fsSL https://ollama.com/install.sh | sh

sudo tee /etc/systemd/system/ollama.service > /dev/null <<EOL
[Unit]
Description=Ollama AI Service
After=network.target

[Service]
ExecStart=/usr/local/bin/ollama serve
Restart=always
User=root

[Install]
WantedBy=multi-user.target
EOL

sleep 5
# Activer et démarrer le service Ollama
sudo systemctl daemon-reload
sudo systemctl enable ollama.service
sudo systemctl start ollama.service

sleep 5

# Installer un modèle dans Ollama
ollama pull llama3.2:1b

# Vérification des logs pour Ollama en cas d'erreur, uniquement pour les installations sans cloud-init
sudo journalctl -u ollama.service --no-pager -n 20

# Installer Nginx sans interaction
sudo DEBIAN_FRONTEND=noninteractive apt update && sudo DEBIAN_FRONTEND=noninteractive apt install nginx -y

# Configurer Nginx
IP=$(hostname -I | awk '{print $1}')

cat <<EOL | sudo tee /etc/nginx/sites-available/ollama
upstream ollama {
    server localhost:11434;
}

server {
    listen 80;
    server_name ${IP};

    location / {
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Configuration des timeouts pour les requêtes
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;

        # Forward request to the actual Ollama service
        proxy_pass http://ollama;
    }
}
EOL

# Activer la configuration Nginx
sudo ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/

# Redémarrer Nginx pour appliquer les changements
sudo systemctl restart nginx

echo "Setup completed successfully!"
