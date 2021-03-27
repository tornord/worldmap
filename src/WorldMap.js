import React, { useRef, useState, useEffect } from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_AUTO, ALIGN_CENTER } from "react-svg-pan-zoom";
// import { svgPathProperties } from 'svg-path-properties';
import countries from "./countries";
import keyBy from "./keyBy";
import { mergeBoundingRects } from "./helpers";

window.mids = {};
window.path = [];
const countriesByCode = keyBy(countries, (d) => d.code);

// function round(x) {
//   return Math.round(10 * x) / 10;
// }

console.log(INITIAL_VALUE);

export default function WorldMap({ dataByCountryCode, onClick, width, height, renderData }) {
  const viewer = useRef(null);
  window.viewer = viewer;
  const [value, setValue] = useState(INITIAL_VALUE);

  useEffect(() => {
    console.log("useEffect fitToViewer");
    viewer.current.fitToViewer();
  }, []);

  let lastCountryClick = null;
  function countryClick(e) {
    const code = e.target.id;
    lastCountryClick = code;
    if (onClick && code !== null) {
      onClick(countriesByCode[code]);
    }
  }
  const br = mergeBoundingRects(Object.entries(dataByCountryCode).map((d) => countriesByCode[d[0]].boundingRect));
  // console.log(value)

  useEffect(() => {
    console.log("bounding rect change");
    viewer.current.fitSelection(br.x, br.y, br.width, br.height);
    // viewer.current.fitToViewer(ALIGN_CENTER,ALIGN_CENTER);
  }, [br.x, br.y, br.width, br.height]);

  return (
    <div>
      <ReactSVGPanZoom
        ref={viewer}
        className="worldmap"
        width={width}
        height={height}
        tool={TOOL_AUTO}
        value={value}
        onChangeValue={setValue}
        onZoom={() => {
          // console.log("zoom", e, viewer.current.getValue());
        }}
        onPan={() => {
          // console.log("pan", e, viewer.current.getValue());
        }}
        onChangeTool={(d) => console.log("onChangeTool", d)}
        onClick={(event) => {
          const { x, y } = event;
          window.mids[lastCountryClick] = {
            code: lastCountryClick,
            midX: x,
            midY: y,
          };
          window.path.push({ x, y });
          console.log("click", window.mids[lastCountryClick]);
        }}
        scaleFactor={1.1}
        scaleFactorMin={0.3}
        scaleFactorMax={100}
        scaleFactorOnWheel={1.1}
        toolbarProps={{ position: "none" }}
        miniatureProps={{ position: "none" }}
        detectAutoPan={false}
        background={"#fff"}
      >
        <svg width={2000} height={857}>
          {Object.values(countriesByCode).map((d, i) => (
            <path
              key={i}
              id={d.code}
              className={dataByCountryCode[d.code] ? "selected" : ""}
              d={d.path}
              onClick={(e) => countryClick(e)}
            />
          ))}
          {value.a && renderData
            ? Object.entries(dataByCountryCode).map((d, i) => renderData(countriesByCode[d[0]], d[1], i, value.a))
            : null}
          <rect className="selection-bounds" {...br} />
        </svg>
      </ReactSVGPanZoom>
    </div>
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
