import React from "react";
import WorldMap from "./WorldMap";
import countries from "./countries";

export default function App() {
  const dataByCountryCode = countries.reduce((dict, c, i) => {
    if (i % 5 !== 0) {
      return dict;
    }
    dict[c.code] = { value: i.toFixed(0) };
    return dict;
  }, {});
  return <WorldMap dataByCountryCode={dataByCountryCode} />;
}
