import React, { useState } from "react";
import countries from "./countries";
import swedenRegions from "./swedenRegions";
import letters from "./letters";
import keyBy from "./keyBy";
import { mergeBoundingRects } from "./helpers";
// import WorldMap from "./WorldMap";
// import SwedenMap from "./SwedenMap";
import { SvgMap, AnimatedSvgMap } from "./SvgMap";

const regions = countries;

// const start = [30, 30, 40];
// const end = [135, 85, 60];
// const interpolator = d3.interpolateZoom(start, end);
// console.log(interpolator(0.1))

// window.mids = {};
// window.path = [];

// console.log(expandBoundingRectToFitWidthHeightRatio({ x: 1, y: 1, width: 4, height: 3 }, 4 / 1));

export default function App() {
  const [randomCode, setRandomCode] = useState(regions[Math.floor(regions.length * Math.random())].code);
  // const dataByRegionId = countries.reduce((dict, c, i) => {
  //   if (i % swedenRegions.length !== randomModulo) {
  //     return dict;
  //   }
  //   dict[c.code] = { value: i.toFixed(0) };
  //   return dict;
  // }, {});
  const regionsById = keyBy(regions, (d) => d.code);
  const dataByRegionId = { [randomCode]: { value: 0 } };
  let br = { x: 0, y: 0, width: 2000, height: 857 };
  const dataEntries = Object.entries(dataByRegionId);
  if (dataEntries.length > 0) {
    br = mergeBoundingRects(dataEntries.map((d) => regionsById[d[0]].boundingRect));
    const margin = 20;
    br.x -= margin;
    br.y -= margin;
    br.width += 2 * margin;
    br.height += 2 * margin;
  }
  return (
    <>
      {/* <WorldMap
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
    />     */}
      <AnimatedSvgMap
        dataByRegionId={dataByRegionId}
        width={620}
        height={400}
        onClick={(region) => {
          console.log("click", region);
          setRandomCode(region.code);
        }}
        fitToSelection={true}
        regions={regions}
        boundingRect={br}
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
