const fs = require("fs");
const { parseString } = require("xml2js");
const { svgPathProperties } = require("svg-path-properties");
// const clipboardy = require("clipboardy");
const keyBy = require("./keyBy");

const worldmapsvg = fs.readFileSync("./src/generate/worldmap.svg", "utf-8");
const countryMids = JSON.parse(fs.readFileSync("./src/generate/countryMids.json", "utf-8"));
const countries = fs
  .readFileSync("./src/generate/countries.csv", "utf-8")
  .split("\n")
  .map((d) => d.split("\t"));
const countriesByCode = keyBy(countries, (d) => d[0]);
const continentCodes = fs
  .readFileSync("./src/generate/country-and-continent-codes-list.csv", "utf-8")
  .split("\n")
  .map((d) => d.split(","));

const continentCodesByCountry = keyBy(continentCodes, (d) => d[3]);

function translate({ x, y }) {
  const dx = 0;
  const dy = 0;
  return { x: x + dx, y: y + dy };
}
function partsToPath(parts) {
  return (
    parts
      .map((d, i, arr) => {
        const pp = arr[(i + arr.length - 1) % arr.length];
        const p = arr[i % arr.length];
        const { x: px, y: py } = translate(pp.start);
        const { x, y } = translate(p.start);
        let z = pp.length < 0.01 && i !== 0 ? "Z" : "";
        if (pp.length < 0.01 || i == 0) {
          return `${z}M${x.toFixed(1)},${y.toFixed(1)}`;
        }
        const dx = x - px;
        const dy = y - py;
        if (Math.abs(dx) < 0.05) {
          return `${z}v${dy.toFixed(1)}`;
        }
        if (Math.abs(dy) < 0.05) {
          return `${z}h${dx.toFixed(1)}`;
        }
        return `${z}l${(x - px).toFixed(1)},${(y - py).toFixed(1)}`;
      })
      .join(" ") + "Z"
  );
}

const extraCountries = [
  {
    class: "sm_state_HK",
    d: "M1618.1,358.1l-0.1,0.9l0.8,0.6h1.2l1.12-0.72l-0.81-1.36L1618.1,358.1z",
  },
  { class: "sm_state_GG", d: "M973.3,183.7 L973.0,184.1 L973.5,184.6 L974.2,184.4 L974.4,183.9 L973.9,183.3 Z" },
  { class: "sm_state_GI", d: "M958.02,270.23l0.25,0.77l0.48,0.07l0.21-0.83l-0.24-0.45z" },
  { class: "sm_state_IM", d: "M962.4,155.1 L962.1,156.6 L962.7,157.4 L963.5,157.0 L963.9,155.7 L963.4,154.5 Z" },
  { class: "sm_state_JE", d: "M974.4,185.8 L974.2,186.4 L974.7,186.7 L975.3,186.6 L975.4,186.0 L975.1,185.7 Z" },
  { class: "sm_state_LI", d: "M1033.95,200.06l0.7,0.4l0.3-0.5l-0.1-0.5h-0.6 Z" },
  { class: "sm_state_MC", d: "M1021.84,222.75l0.1,0.7h0.9l0.8-0.5l0.2-0.8l-0.7-0.2L1021.84,222.75z" },
];

function gravity(points) {
  let sumArea = 0,
    sumX = 0,
    sumY = 0;
  for (let i = 0; i < points.length; i++) {
    let i_p = (i + 1) % points.length;
    let g = points[i].x * points[i_p].y - points[i_p].x * points[i].y;
    sumArea += g;
    sumX += (points[i].x + points[i_p].x) * g;
    sumY += (points[i].y + points[i_p].y) * g;
  }
  sumArea = 3 * sumArea;
  return { x: sumX / sumArea, y: sumY / sumArea };
}

function main() {
  parseString(worldmapsvg, (err, xml) => {
    let paths = xml.svg.path;
    extraCountries.forEach((d) => {
      paths.push({ $: d });
    });
    let minX = null;
    let minY = null;
    let maxX = null;
    let maxY = null;
    const countries = [];

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const code = path.$.class.replace("sm_state_", "");
      if (code === "FR") {
        console.log("meow");
      }
      const properties = new svgPathProperties(path.$.d);
      const parts = properties.getParts();
      for (let i = 0; i < parts.length; i++) {
        const { x, y } = translate(parts[i].start);
        if (minX === null || x < minX) {
          minX = x;
        }
        if (maxX === null || x > maxX) {
          maxX = x;
        }
        if (minY === null || y < minY) {
          minY = y;
        }
        if (maxY === null || y > maxY) {
          maxY = y;
        }
      }
      if (code.startsWith("BQ")) {
        continue;
      }
      const contCodes = continentCodesByCountry[code];
      let continentCode = null;
      if (contCodes) {
        continentCode = contCodes[1];
      } else {
        console.log("meow");
      }
      let name = null;
      if (countriesByCode[code]) {
        name = countriesByCode[code][1];
      } else {
        console.log("meow");
      }
      let cm = countryMids.find((d) => d.code === code);
      if (!cm) {
        const p = gravity(parts.map((d) => ({ x: d.start.x, y: d.start.y })));
        cm = { midX: p.x.toFixed(1), midY: p.y.toFixed(1) };
      }
      countries.push({
        code,
        continentCode,
        name,
        path: partsToPath(parts),
        midX: cm ? cm.midX : null,
        midY: cm ? cm.midY : null,
      });
    }
    let svg =
      `<svg id="world" version="1.1" viewBox="${[minX, minY, maxX - minX, maxY - minY]
        .map((d) => d.toFixed(1))
        .join(" ")}" preserveAspectRatio="xMidYMid">\n` +
      `${countries
        .map((d, i) => `<path id="${d.code}" ${d.continentCode === null ? `class="nocontinent" ` : ""}d="${d.path}"/>`)
        .join("\n")}\n` +
      `</svg>`;
    // clipboardy.writeSync(svg);
    fs.writeFileSync("./src/countries.js", `module.exports = ${JSON.stringify(countries, null, 2)};\n`, "utf-8");
    console.log("meow");
  });
}

main();
