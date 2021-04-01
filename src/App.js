import React, { useRef, useState, useEffect } from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_AUTO } from "react-svg-pan-zoom";
// import { svgPathProperties } from 'svg-path-properties';
import countries from "./countries";
import swedenRegions from "./swedenRegions";
import letters from "./letters";
import keyBy from "./keyBy";
import { mergeBoundingRects } from "./helpers";
import WorldMap from "./WorldMap";
import SwedenMap from "./SwedenMap";
import LettersMap from "./LettersMap";

window.mids = {};
window.path = [];

// console.log(expandBoundingRectToFitWidthHeightRatio({ x: 1, y: 1, width: 4, height: 3 }, 4 / 1));

export default function App() {
  const [randomModulo, setRandomModulo] = useState(Math.floor(swedenRegions.length * Math.random()));
  const dataByCountryCode = countries.reduce((dict, c, i) => {
    if (i % swedenRegions.length !== randomModulo) {
      return dict;
    }
    dict[c.code] = { value: i.toFixed(0) };
    return dict;
  }, {});
  const r = swedenRegions[randomModulo];
  const dataByRegionCode = { [r.code]: { value: 0 } };
  return (
    <>
    <WorldMap
      dataByCountryCode={dataByCountryCode}
      width={620}
      height={400}
      onClick={(country) => {
        console.log("click", country);
        setRandomModulo(Math.floor(15 * Math.random()));
      }}
      fitToSelection={true}
    />
    <SwedenMap
      dataByCountryCode={dataByRegionCode}
      width={620}
      height={400}
      onClick={(country) => {
        console.log("click", country);
        setRandomModulo(Number(country.code.replace("R","")));
      }}
      fitToSelection={true}
    />
    <LettersMap
      dataByCountryCode={{ [letters[randomModulo].code]: { value: 0 } }}
      width={620}
      height={400}
      onClick={(country) => {
        console.log("click", country);
        setRandomModulo(Number(country.code.replace("R","")));
      }}
      fitToSelection={true}
    />
    </>
  );
}

// {Object.entries(totalsPerCountry).map((d, i) => {
//   const { name, midX, midY } = countriesByCode[d[0]];

// function renderData() {
//   const { name, midX, midY } = countriesByCode[d[0]];
//   const fontSize = 11 / value.a;
//   return (
//     <text key={i} y={midY} className='selected country-text' fontSize={fontSize.toFixed(2)} alignmentBaseline='middle'>
//       <tspan className='row1' x={midX} dy={0}>
//         {name}
//       </tspan>
//       <tspan className='row2' x={midX} dy={(fontSize * 9) / 8}>
//         {d[1].value.toFixed(1)}
//       </tspan>
//     </text>
//   );
// }
