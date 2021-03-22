"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keyBy;

function keyBy(collection, iteratee) {
  return collection.reduce((p, c) => {
    const key = iteratee(c);

    if (typeof key !== "undefined" && key !== null) {
      p[key] = c;
    }

    return p;
  }, {});
}
//# sourceMappingURL=keyBy.js.map