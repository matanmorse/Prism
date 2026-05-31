cd ../
set -a
source .env
set +a
echo "Github Token: $GITHUB_TOKEN"
cd ./src/renderer
vite build
cd ../../
npm run publish
read -p "Press Enter to exit..."
