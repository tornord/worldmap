import React from "react";
import WorldMap from "./WorldMap";
import countries from "./countries";

const rnd = Math.floor(5 * Math.random());
export default function App() {
  const dataByCountryCode = countries.reduce((dict, c, i) => {
    if (i % 5 !== rnd) {
      return dict;
    }
    dict[c.code] = { value: i.toFixed(0) };
    return dict;
  }, {});
  return <WorldMap dataByCountryCode={dataByCountryCode} width={620} height={480} />;
}
