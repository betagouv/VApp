#!/bin/bash

# Mettre à jour les paquets et mettre à niveau le système
sudo apt update && sudo apt upgrade -y

# Installer CUDA Toolkit pour NVIDIA
sudo apt install nvidia-cuda-toolkit -y

# Télécharger et installer ollama
curl -fsSL https://ollama.com/install.sh | sh


# Attends que Ollama soit prêt (vous pouvez ajuster les délais selon vos besoins)
echo "Attente de l'initialisation d'Ollama..."
while ! curl -s http://localhost:11434/health &> /dev/null; do
    sleep 5
    echo "En attente... Vérifiez si Ollama est prêt."
done

ollama pull llama3.2:1b  # Utiliser & pour exécuter en arrière-plan


echo "Setup completed successfully!"