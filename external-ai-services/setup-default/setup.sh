#!/bin/bash

# Mettre à jour les paquets et mettre à niveau le système
sudo apt update && sudo apt upgrade -y

# Installer CUDA Toolkit pour NVIDIA
sudo apt install nvidia-cuda-toolkit -y

# Télécharger et installer ollama
curl -fsSL https://ollama.com/install.sh | sh

sleep 5

# Attendre que Ollama soit prêt (vous pouvez ajuster les délais selon vos besoins)
echo "Attente de l'initialisation d'Ollama..."
while ! ollama --version &> /dev/null; do
    sleep 5
    echo "En attente... Vérifiez si Ollama est prêt."
done

echo "Ollama est prêt et fonctionne correctement."

# Installer un modèle dans Ollama
ollama pull llama3.2:1b

# Vérification des logs pour Ollama en cas d'erreur, uniquement pour les instalations sans clou-init
sudo journalctl -u ollama.service --no-pager -n 20

# Installer Nginx
sudo apt update && sudo apt install nginx -y

# Configurer Nginx
IP=$(hostname -I | awk '{print $1}')
TOKEN=$BEARER_TOKEN

cat <<EOL | sudo tee /etc/nginx/sites-available/ollama
upstream ollama {
    server localhost:11434;
}

server {
    listen 80;
    server_name ${IP};

    location / {
        # Check if the Authorization header is present and has the correct Bearer token / API Key
        set \$token "Bearer $TOKEN";
        if (\$http_authorization != \$token) {
            return 401 "Unauthorized";
        }

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # Configuration des timeouts pour les requêtes
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;

        # Forward request to the actual web service
        proxy_pass http://ollama;
    }
}
EOL

# Activer la configuration Nginx
sudo ln -s /etc/nginx/sites-available/ollama /etc/nginx/sites-enabled/

# Redémarrer Nginx pour appliquer les changements
sudo systemctl restart nginx

echo "Setup completed successfully!"