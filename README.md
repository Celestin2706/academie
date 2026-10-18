# Apprendre le code

Site d'apprentissage de Python et JavaScript : leçons, exercices avec
correction automatique, éditeur de code en ligne et tchat avec l'administrateur.

## Technologies

- Front end : React (Vite) et Tailwind CSS
- Back end : Laravel (API) avec Sanctum
- Exécution du code : Piston (Docker)

## Lancer le projet

Back end :

```
cd backend_academie
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=LanguageSeeder
php artisan serve
```

Front end :

```
cd frontend_academie
npm install
npm run dev
```

Exécution du code : cloner https://github.com/engineer-man/piston, y régler les
limites de temps dans `docker-compose.yaml`, puis `docker compose up -d api` et
installer les paquets `python` et `node`.