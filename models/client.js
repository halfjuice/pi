import axios from 'axios';

export function createObject(fields) {
  return axios.put('/v1/objects/', fields).then(res => res.data);
}

export function getObjectByID(id) {
  return axios.get(`/v1/objects/${id}`).then(res => res.data);
}

export function findObjects(query, skip, limit) {
  return axios.get('/v1/objects', {
	  params: {
      query: JSON.stringify(query),
	    skip: skip,
	    limit: limit,
	  },
  }).then(res => res.data);
}

export function searchObjects(type, text, skip, limit) {
  return axios.get('/v1/objects/search', {
    params: {
      type: type,
      text: text,
      skip: skip,
      limit: limit,
    },
  }).then(res => res.data);
}
