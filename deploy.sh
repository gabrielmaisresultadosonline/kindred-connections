#!/bin/bash

# ==========================================================================
# ZapMRO Cloud - Professional Deploy Script
# Destination: Hostinger VPS (Ubuntu 24.04 LTS)
# Target IP: 167.88.42.133
# ==========================================================================

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Starting ZapMRO Cloud professional deployment...${NC}"

# 1. Update system and install dependencies
echo -e "${GREEN}Updating system and installing dependencies...${NC}"
sudo apt-get update
sudo apt-get install -y curl git wget build-essential libgbm-dev \
    libnss3 libatk-bridge2.0-0 libgtk-3-0 libasound2 libxss1 \
    libxtst6 xauth xvfb ffmpeg chromium-browser ufw

# Configure Firewall
echo -e "${GREEN}Configuring Firewall (UFW)...${NC}"
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 4000/tcp
sudo ufw allow 22/tcp
sudo ufw --force enable

# 2. Install Node.js (Latest LTS)
if ! command -v node &> /dev/null; then
    echo -e "${GREEN}Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 3. Install Nginx and PM2
echo -e "${GREEN}Installing Nginx and PM2...${NC}"
sudo apt-get install -y nginx
sudo npm install -g pm2

# 4. Create Project Directory
PROJECT_DIR="/var/www/zapmro"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# 5. Clone Repository
echo -e "${GREEN}Cloning project from GitHub...${NC}"
if [ -d ".git" ]; then
    git pull origin main
else
    git clone https://github.com/gabrielmaisresultadosonline/kindred-connections.git .
fi

# 6. Setup Frontend
echo -e "${GREEN}Building Frontend...${NC}"
npm install
npm run build

# 7. Setup Backend
echo -e "${GREEN}Setting up Backend...${NC}"
cd backend
npm install
npm run build

# 8. Configure Environment Variables
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating backend .env template...${NC}"
    cat <<EOT >> .env
PORT=4000
JWT_SECRET="$(openssl rand -base64 32)"
CHROME_PATH="/usr/bin/chromium-browser"
NODE_ENV=production
EOT
fi
cd ..

# 9. Configure Nginx
echo -e "${GREEN}Configuring Nginx...${NC}"
sudo cat <<EOT > /etc/nginx/sites-available/zapmro
server {
    listen 80;
    server_name 167.88.42.133;

    # Frontend - Static Files
    location / {
        root $PROJECT_DIR/dist/client;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Security & Performance
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:4000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
        client_max_body_size 50M;
    }

    # Socket.IO
    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }
}
EOT

# Ensure permissions for Nginx - VERY IMPORTANT
echo -e "${GREEN}Applying strict permissions for Nginx...${NC}"
sudo chown -R www-data:www-data $PROJECT_DIR
sudo find $PROJECT_DIR -type d -exec chmod 755 {} \;
sudo find $PROJECT_DIR -type f -exec chmod 644 {} \;

# Ensure Nginx can execute the directory path
sudo chmod +x /var
sudo chmod +x /var/www
sudo chmod +x /var/www/zapmro
sudo chmod +x /var/www/zapmro/dist
sudo chmod +x /var/www/zapmro/dist/client

sudo ln -sf /etc/nginx/sites-available/zapmro /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 10. Start Services with PM2
echo -e "${GREEN}Starting backend with PM2...${NC}"

# Start Backend
cd $PROJECT_DIR/backend
# Ensure dist directory exists
if [ ! -f "dist/index.js" ]; then
    echo -e "${RED}Error: dist/index.js not found. Attempting to rebuild...${NC}"
    npm run build
fi

pm2 delete zapmro-api 2>/dev/null || true
pm2 start dist/index.js --name zapmro-api
pm2 save
pm2 startup

echo -e "${BLUE}====================================================${NC}"
echo -e "${GREEN}Deployment Finished Successfully!${NC}"
echo -e "Access your app at: http://167.88.42.133"
echo -e "${BLUE}IMPORTANT:${NC} Don't forget to configure your .env in $PROJECT_DIR/backend/.env"
echo -e "${BLUE}====================================================${NC}"
