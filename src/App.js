import React, { useState } from "react";
import WorldMap from "./WorldMap";
import countries from "./countries";

export default function App() {
  const [randomModulo, setRandomModulo] = useState(Math.floor(15 * Math.random()));
  const dataByCountryCode = countries.reduce((dict, c, i) => {
    if (i % 15 !== randomModulo) {
      return dict;
    }
    dict[c.code] = { value: i.toFixed(0) };
    return dict;
  }, {});
  return (
    <WorldMap
      dataByCountryCode={dataByCountryCode}
      width={620}
      height={400}
      onClick={(country) => {
        console.log("click", country);
        setRandomModulo(Math.floor(15 * Math.random()));
      }}
    />
  );
}
