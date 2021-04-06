import React, { useRef, useState, useEffect, useMemo } from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_AUTO } from "react-svg-pan-zoom";
import { Animate } from "react-move";
import * as d3 from "d3";
import keyBy from "./keyBy";

window.mids = {};
window.path = [];

function expandBoundingRectToFitWidthHeightRatio(boundingRect, widthHeightRatio) {
  let w1 = widthHeightRatio * boundingRect.height;
  let h1 = boundingRect.width / widthHeightRatio;
  if (w1 > boundingRect.width) {
    h1 = boundingRect.height;
  } else {
    w1 = boundingRect.width;
  }
  const x1 = boundingRect.x + (boundingRect.width - w1) / 2;
  const y1 = boundingRect.y + (boundingRect.height - h1) / 2;
  return { x: x1, y: y1, width: w1, height: h1 };
}

// console.log(expandBoundingRectToFitWidthHeightRatio({ x: 1, y: 1, width: 4, height: 3 }, 4 / 1));

export function AnimatedSvgMap({ width, height, regions, dataByRegionId, onClick, renderData, boundingRect }) {
  return (
    <Animate
      start={{ boundingRect }}
      enter={{ boundingRect: [boundingRect] }}
      update={{ boundingRect: [boundingRect] }}
      interpolation={(begValue, endValue) => (t) => {
        const start = [
          begValue.x + begValue.width / 2,
          begValue.y + begValue.height / 2,
          Math.max(begValue.width, begValue.height),
        ];
        const end = [
          endValue.x + endValue.width / 2,
          endValue.y + endValue.height / 2,
          Math.max(endValue.width, endValue.height),
        ];
        const interpolator = d3.interpolateZoom(start, end);
        const v = interpolator(t);
        return { x: v[0] - v[2] / 2, y: v[1] - v[2] / 2, width: v[2], height: v[2] };
      }}
    >
      {({ boundingRect }) => (
        <SvgMap
          width={width}
          height={height}
          regions={regions}
          dataByRegionId={dataByRegionId}
          onClick={onClick}
          renderData={renderData}
          boundingRect={boundingRect}
        />
      )}
    </Animate>
  );
}

export function SvgMap({ width, height, regions, dataByRegionId, onClick, renderData, boundingRect }) {
  const viewer = useRef(null);
  window.viewer = viewer;
  const [value, setValue] = useState(INITIAL_VALUE);
  const regionsById = useMemo(() => keyBy(regions, (d) => d.code), [regions]);

  useEffect(() => {
    console.log("useEffect fitToViewer");
    viewer.current.fitToViewer();
  }, []);

  let lastCountryClick = null;
  function countryClick(e) {
    const code = e.target.id;
    lastCountryClick = code;
    if (onClick && code !== null) {
      onClick(regionsById[code]);
    }
  }

  useEffect(() => {
    console.log("bounding rect change");
    let br = expandBoundingRectToFitWidthHeightRatio(boundingRect, width / height);
    viewer.current.fitSelection(br.x, br.y, br.width, br.height);
  }, [boundingRect.x, boundingRect.y, boundingRect.width, boundingRect.height]);

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
        scaleFactorMax={10}
        scaleFactorOnWheel={1.1}
        toolbarProps={{ position: "none" }}
        miniatureProps={{ position: "none" }}
        detectAutoPan={false}
        background={"#fff"}
      >
        <svg width={2000} height={857}>
          {Object.values(regionsById).map((d, i) => (
            <path
              key={i}
              id={d.code}
              className={dataByRegionId[d.code] ? "selected" : ""}
              d={d.path}
              onClick={(e) => countryClick(e)}
            />
          ))}
          {value.a && renderData
            ? Object.entries(dataByRegionId).map((d, i) => renderData(regionsById[d[0]], d[1], i, value.a))
            : null}
          {boundingRect ? <rect className="selection-bounds" {...boundingRect} /> : null}
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
