thisScriptDir=$(dirname "$0")
rootDir=$thisScriptDir/..

outputDir=$rootDir/dist

node "$rootDir/etc/clean-directory.mjs" "$outputDir"
npx --prefix "$rootDir" tsc
npx copyfiles -u 1 "$rootDir/src/index.html" "$outputDir"
npx copyfiles -u 1 "$rootDir/src/index.css" "$outputDir"
npx copyfiles -u 2 "$rootDir/src/assets/**/*.{jpg,png}" "$outputDir/assets"
