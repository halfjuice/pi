import axios from 'axios';

export function createObject(fields) {
  return axios.put('/v1/objects/', fields).then(res => res.data);
}

export function getObjectByID(id) {
  return axios.get(`/v1/objects/${id}`).then(res => res.data);
}

export function updateObject(id, newValue) {
  return axios.post(`/v1/objects/${id}`, newValue).then(res => res.data);
}

export function findObjectsByIDs(ids) {
  return axios.get(`/v1/objects/multiID`, {
    params: {ids: JSON.stringify(ids)}
  }).then(res => res.data);
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

export function findPagedObjects(query, pageLimit, pageNo) {
  return axios.get('/v1/objects/paged', {
	  params: {
      query: JSON.stringify(query),
	    limit: pageLimit,
	    page: pageNo,
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

export function createDummyData() {
  return Promise.all([
    // Type
    createObject({type: 0, name: 'Task', description: 'text'}),
    createObject({type: 0, name: 'Tag', description: 'text'}),
  ]).then(([taskType, tagType]) => {
    return Promise.all([
      // Rel Type
      createObject({type: 1, name: 'Children', srcType: taskType._id, dstType: taskType._id}),
      createObject({type: 1, name: 'Tag', srcType: taskType._id, dstType: tagType._id}),
    ]);
  }).then(([childrenRelType, tagRelType]) => {
    let taskTypeID = childrenRelType.srcType;
    let tagTypeID = tagRelType.dstType;
    return Promise.all([
      // Object
      createObject({type: taskTypeID, name: 'Daily Work'}),
      createObject({type: taskTypeID, name: 'Buy the milk'}),
      createObject({type: tagTypeID, name: 'Grocery'}),

      // View
      createObject({type: 2, name: 'New Task', viewType: 'create', objectType: taskTypeID}),
      createObject({type: 2, name: 'New Tag', viewType: 'create', objectType: tagTypeID}),
    ]).then(([task1, task2, tag1, view1, view2]) => {
      return Promise.all([
        // Relation
        createObject({_isRelation: 1, type: childrenRelType._id, src: task1._id, dst: task2._id}),
        createObject({_isRelation: 1, type: tagRelType._id, src: task2._id, dst: tag1._id}),
      ]);
    });;
  })

}

export function createDummyData1() {
  return Promise.all([

  ]);
}
