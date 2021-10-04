#create neccessary default folder setup
[ ! -d "/home/zubhub_backend" ] && mkdir -p "/home/zubhub_backend" && touch "/home/zubhub_backend/.env"
[ ! -d "/home/zubhub_frontend/zubhub" ] && mkdir -p "/home/zubhub_frontend/zubhub" && touch "/home/zubhub_frontend/zubhub/.env"

#setup docker and docker-compose if not available
hash docker-compose 2>/dev/null && { echo >&2 "docker already installed.  Aborting."; return; }

sudo apt update -y
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release -y

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose -y

sudo usermod -aG docker ${USER}