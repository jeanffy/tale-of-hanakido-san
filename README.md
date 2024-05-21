# tale-of-hanakido-san

Demo here: https://jeanffy.github.io/tale-of-hanakido-san

## Development

- run Docker container to serve the game: `docker compose up -d`
- build the game: `npm start` (game will be automatically rebuilt with changes using Nodemon)
- visit http://localhost:8080

## Debug

- run Docker container to serve the game: `docker compose up -d`
- build the game: `npm start` (game will be automatically rebuilt with changes using Nodemon)
- select debug target "Debug" in VSCode "Run and Debug" section
- press F5

When changes are made to the code, no need to restart debugging, nor `npm start` command.

## Publish

`npm run publish`: game files are installed into the `docs` folder, used by Github Pages

Publish automatically run `format` and `build`.

## Format

`npm run format`: formatting files with Prettier

## Build

`npm run build`: build code in `dist` folder
