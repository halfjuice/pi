

export function tuples2obj(arr) {
  var obj = {};
  for (var i=0; i<arr.length; i++) {
    var tup = arr[i];
    obj[tup[0]] = tup[1];
  }
  return obj;
}
