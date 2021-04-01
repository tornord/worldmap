import fs from "fs";
import { parseString } from "xml2js";
import { svgPathProperties } from "svg-path-properties";
import { boundingRect, mergeBoundingRects, midPoint, translate } from "./helpers";
import { svgPathBbox } from "svg-path-bbox";

function round(x) {
  return Math.round(100 * x) / 100;
}
const names = "ABCDEFGHIJKLMNOPQ".split("");

function main() {
  const dx = 0;
  const dy = 0;
  const regions = [];
  const swedenSvg = fs.readFileSync("./letters.svg", "utf-8");
  parseString(swedenSvg, (err, xml) => {
    let paths = xml.svg.path;
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const properties = new svgPathProperties(path.$.d);
      const parts = properties.getParts();
      const points = parts.map((d) => d.start).map((d) => translate(d, dx, dy));
      const mid = midPoint(points);
      let bb = svgPathBbox(path.$.d);
      const br = { x: bb[0], y: bb[1], width: bb[2] - bb[0], height: bb[3] - bb[1] };
      console.log(br);
      // br = boundingRect(points);
      regions.push({
        code: `R${i}`,
        name: names[i],
        path: path.$.d, //: partsToPath(parts, dx, dy),
        midX: round(mid.x),
        midY: round(mid.y),
        boundingRect: { x: round(br.x), y: round(br.y), width: round(br.width), height: round(br.height) },
      });
    }
    console.log(mergeBoundingRects(regions.map((d) => d.boundingRect)), regions.length);
    fs.writeFileSync("../letters.js", `module.exports = ${JSON.stringify(regions, null, 2)};\n`, "utf-8");
  });
}

main();
