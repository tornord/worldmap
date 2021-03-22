# worldmap
SVG World Map, zoomable and pannable

https://github.com/chrvadala/react-svg-pan-zoom/blob/main/docs/documentation.md

## Install Babel

1.
npm install --save-dev @babel/cli @babel/preset-react @babel/plugin-transform-modules-commonjs

2.
.babelrc
{
  "presets": ["@babel/react"],
  "plugins": ["@babel/plugin-transform-modules-commonjs"]
}

3.
Add script "babel"
babel src/WorldMap.js -d dist --copy-files -s && cp ./src/countries.js ./dist