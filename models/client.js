import axios from 'axios';

export function createObject(fields) {
  return axios.put('/v1/objects/', fields);
}

export function getObjectByID(id) {
  return axios.get('/v1/object/${id}');
}

export function findObjects(skip, limit) {
  return axios.get('/v1/objects', {
	  params: {
	    skip: skip,
	    limit: limit,
	  },
  });
}
