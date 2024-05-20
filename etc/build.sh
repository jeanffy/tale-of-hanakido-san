node etc/clean-directory.mjs dist
npx tsc
npx copyfiles -u 1 src/index.html dist
npx copyfiles -u 1 src/index.css dist
npx copyfiles -u 2 "src/assets/**/*.{jpg,png}" dist/assets
