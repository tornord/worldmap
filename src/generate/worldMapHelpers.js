"use strict";

const { svgPathProperties: SvgPathProperties } = require("svg-path-properties");

function midPoint(points) {
  let sumArea = 0,
    sumX = 0,
    sumY = 0;

  for (let i = 0; i < points.length; i++) {
    const ip = (i + 1) % points.length;
    const g = points[i].x * points[ip].y - points[ip].x * points[i].y;
    sumArea += g;
    sumX += (points[i].x + points[ip].x) * g;
    sumY += (points[i].y + points[ip].y) * g;
  }

  sumArea = 3 * sumArea;
  return {
    x: sumX / sumArea,
    y: sumY / sumArea,
  };
}

function boundingRect(points) {
  const minX = Math.min(...points.map((d) => d.x));
  const minY = Math.min(...points.map((d) => d.y));
  const maxX = Math.max(...points.map((d) => d.x));
  const maxY = Math.max(...points.map((d) => d.y));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function mergeBoundingRects(boundingRects) {
  const minX = Math.min(...boundingRects.map((d) => d.x));
  const minY = Math.min(...boundingRects.map((d) => d.y));
  const maxX = Math.max(...boundingRects.map((d) => d.x + d.width));
  const maxY = Math.max(...boundingRects.map((d) => d.y + d.height));
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function countryBoundingRect(country) {
  const properties = new SvgPathProperties(country.path);
  const parts = properties.getParts();
  return boundingRect(parts.map((e) => e.start));
}

module.exports = { midPoint, boundingRect };
