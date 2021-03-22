import { useRef, useState, useEffect } from "react";
import {
  INITIAL_VALUE,
  ReactSVGPanZoom,
  TOOL_AUTO,
  fitSelection,
  zoomOnViewerCenter,
  fitToViewer,
} from "react-svg-pan-zoom";
import countries from "./countries";

window.mids = {};
window.path = [];

export default function App() {
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
          {countries.map((d, i) => (
            <path
              key={i}
              id={d.code}
              className={i%2===0 ? "holdings" : ""}
              d={d.path}
              onClick={(e) => countryClick(e)}
            />
          ))}
          {countries.map((d, i) => {
            const { name, midX, midY } = d;
            const fontSize = (5 * 2.15) / value.a;
            return (
              <text key={i} y={Number(midY)} className={i%2===0 ? "holdings" : ""} fontSize={fontSize} alignmentBaseline="middle">
                <tspan x={Number(midX)} dy={0}>
                  {name}
                </tspan>
                <tspan x={Number(midX)} dy={(fontSize * 9) / 8}>
                  {i}
                </tspan>
              </text>
            );
          })}
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
}

// {Object.entries(totalsPerCountry).map((d, i) => {
//   const { name, midX, midY } = countriesByCode[d[0]];