"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WorldMap;

var _react = require("react");

var _reactSvgPanZoom = require("react-svg-pan-zoom");

var _svgPathProperties = require("svg-path-properties");

var _countries = _interopRequireDefault(require("./countries"));

var _keyBy = _interopRequireDefault(require("./keyBy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.mids = {};
window.path = [];
const countriesByCode = (0, _keyBy.default)(_countries.default, d => d.code);

function WorldMap({
  dataByCountryCode
}) {
  const viewer = (0, _react.useRef)(null);
  window.viewer = viewer;
  const [value, setValue] = (0, _react.useState)(_reactSvgPanZoom.INITIAL_VALUE);
  (0, _react.useEffect)(() => {
    viewer.current.fitToViewer();
  }, []);
  let lastCountryClick = null;

  function countryClick(e) {
    const code = e.target.id;
    lastCountryClick = code;
  }

  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_reactSvgPanZoom.ReactSVGPanZoom, {
    ref: viewer,
    width: 520,
    height: 520,
    tool: _reactSvgPanZoom.TOOL_AUTO,
    value: value,
    onChangeValue: setValue,
    onZoom: e => {// console.log("zoom", e, viewer.current.getValue());
    },
    onPan: e => {// console.log("pan", e, viewer.current.getValue());
    },
    onChangeTool: d => console.log("onChangeTool", d),
    onClick: event => {
      const {
        x,
        y
      } = event;
      window.mids[lastCountryClick] = {
        code: lastCountryClick,
        midX: x.toFixed(1),
        midY: y.toFixed(1)
      };
      window.path.push({
        x,
        y
      });
      console.log("click", window.mids[lastCountryClick]);
    },
    scaleFactor: 1.1,
    scaleFactorMin: 0.3,
    scaleFactorMax: 100,
    scaleFactorOnWheel: 1.1,
    toolbarProps: {
      position: "none"
    },
    miniatureProps: {
      position: "none"
    },
    detectAutoPan: false,
    background: "#fff"
  }, /*#__PURE__*/React.createElement("svg", {
    id: "world",
    version: "1.1",
    width: 2000,
    height: 857,
    preserveAspectRatio: "xMidYMid"
  }, Object.values(countriesByCode).map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    id: d.code,
    className: dataByCountryCode[d.code] ? "selected" : "",
    d: d.path,
    onClick: e => countryClick(e)
  })), value.a ? Object.entries(dataByCountryCode).map((d, i) => {
    const {
      name,
      midX,
      midY
    } = countriesByCode[d[0]];
    const fontSize = 5 * 2.15 / value.a;
    return /*#__PURE__*/React.createElement("text", {
      key: i,
      y: midY,
      className: "selected country-text",
      fontSize: fontSize.toFixed(2),
      alignmentBaseline: "middle"
    }, /*#__PURE__*/React.createElement("tspan", {
      className: "row1",
      x: midX,
      dy: 0
    }, name), /*#__PURE__*/React.createElement("tspan", {
      className: "row2",
      x: midX,
      dy: fontSize * 9 / 8
    }, d[1].value));
  }) : null)));
} // {Object.entries(totalsPerCountry).map((d, i) => {
//   const { name, midX, midY } = countriesByCode[d[0]];
//# sourceMappingURL=WorldMap.js.map