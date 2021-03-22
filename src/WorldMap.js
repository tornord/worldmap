import { useRef, useState, useEffect } from "react";
import {
  INITIAL_VALUE,
  ReactSVGPanZoom,
  TOOL_AUTO,
  fitSelection,
  zoomOnViewerCenter,
  fitToViewer,
} from "react-svg-pan-zoom";
import { svgPathProperties } from "svg-path-properties";
import countries from "./countries";
import keyBy from "./keyBy";

window.mids = {};
window.path = [];
const countriesByCode = keyBy(countries, (d) => d.code);

export default function WorldMap({ dataByCountryCode }) {
  const viewer = useRef(null);
  window.viewer = viewer;
  const [value, setValue] = useState(INITIAL_VALUE);

  useEffect(() => {
    viewer.current.fitToViewer();
  }, []);

  let lastCountryClick = null;
  function countryClick(e) {
    const code = e.target.id;
    lastCountryClick = code;
  }
  return (
    <div>
      <ReactSVGPanZoom
        ref={viewer}
        width={520}
        height={520}
        tool={TOOL_AUTO}
        value={value}
        onChangeValue={setValue}
        onZoom={(e) => {
          // console.log("zoom", e, viewer.current.getValue());
        }}
        onPan={(e) => {
          // console.log("pan", e, viewer.current.getValue());
        }}
        onChangeTool={(d) => console.log("onChangeTool", d)}
        onClick={(event) => {
          const { x, y } = event;
          window.mids[lastCountryClick] = {
            code: lastCountryClick,
            midX: x.toFixed(1),
            midY: y.toFixed(1),
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
        <svg id="world" version="1.1" width={2000} height={857} preserveAspectRatio="xMidYMid">
          {Object.values(countriesByCode).map((d, i) => (
            <path
              key={i}
              id={d.code}
              className={dataByCountryCode[d.code] ? "selected" : ""}
              d={d.path}
              onClick={(e) => countryClick(e)}
            />
          ))}
          {value.a
            ? Object.entries(dataByCountryCode).map((d, i) => {
                const { name, midX, midY } = countriesByCode[d[0]];
                const fontSize = (5 * 2.15) / value.a;
                return (
                  <text
                    key={i}
                    y={midY}
                    className="selected country-text"
                    fontSize={fontSize.toFixed(2)}
                    alignmentBaseline="middle"
                  >
                    <tspan className="row1" x={midX} dy={0}>
                      {name}
                    </tspan>
                    <tspan className="row2" x={midX} dy={(fontSize * 9) / 8}>
                      {d[1].value}
                    </tspan>
                  </text>
                );
              })
            : null}
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
}

// {Object.entries(totalsPerCountry).map((d, i) => {
//   const { name, midX, midY } = countriesByCode[d[0]];
