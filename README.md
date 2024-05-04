# tale-of-hanakido-san

Demo here: https://jeanffy.github.io/tale-of-hanakido-san

## Development

- run Docker container to serve the game: `docker compose up -d`
- build the game: `npm start` (game will be automatically rebuilt with changes using Nodemon)
- visit http://localhost:8080

## Publish

- `npm run build` if not already done
- `npm run publish`: game files are installed into the `docs` folder, used by Github Pages
