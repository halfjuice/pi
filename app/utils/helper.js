

export function tuples2obj(arr) {
  var obj = {};
  for (var tup in arr) {
    obj[tup[0]] = tup[1];
  }
  return obj;
}
