import axios from 'axios';

export function createObject(fields) {
  return axios.put('/v1/objects/', fields);
}

export function getObjectByID(id) {
  return axios.get('/v1/object/${id}');
}

export function findObjects(query, skip, limit) {
  return axios.get('/v1/objects', {
	  params: {
      query: JSON.stringify(query),
	    skip: skip,
	    limit: limit,
	  },
  });
}
