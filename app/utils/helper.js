

function tuples2obj(arr) {
  if (!arr) {
    return {};
  }
  var obj = {};
  for (var i=0; i<arr.length; i++) {
    var tup = arr[i];
    obj[tup[0]] = tup[1];
  }
  return obj;
}

function obj2tuples(obj) {
  if (!obj) {
    return [];
  }
  var tuples = [];
  for (var k in obj) {
    tuples.push([k, obj[k]]);
  }
  return tuples;
}

function mergeDict(a, b) {
  return tuples2obj(obj2tuples(a).concat(obj2tuples(b)));
}

module.exports = {
  tuples2obj: tuples2obj,
  obj2tuples: obj2tuples,
  mergeDict: mergeDict,
}
