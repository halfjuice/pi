import axios from 'axios';
import util from 'util';
import { mergeDict, tuples2obj } from '../app/utils/helper';

const HOST = 'https://notely.halfjuice.com:6984/'

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import PouchAuth from 'pouchdb-authentication';
PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchAuth);

const PrimType = {
  Type: 0,
  // DEPRECATED
  //RelType: 1,
  View: 2,
  History: 3,
}

var __localSessionCache = {};

export function logIn(username, password) {
  var db = new PouchDB(HOST + '_users', {skip_setup: true});
  return db.logIn(username, password).then(() => {
    __localSessionCache = {loaded: true, username: username};
  });
}

export function signUp(username, password) {
  var db = new PouchDB(HOST + '_users', {skip_setup: true});
  return db.signUp(username, password);
}

export function logOut() {
  var db = new PouchDB(HOST + '_users', {skip_setup: true});
  return db.logOut().then(() => {
    __localSessionCache = {loaded: true, username: null};
  });
}

export function changePassword(username, password) {
  var db = new PouchDB(HOST + '_users', {skip_setup: true});
  return db.changePassword(username, password);
}

export function getCurrentUsername() {
  if (__localSessionCache.loaded) {
    return Promise.resolve(__localSessionCache.username);
  }

  var db = new PouchDB(HOST + '_users', {skip_setup: true});
  return db.getSession().then(res => {
    __localSessionCache = {loaded: true, username: res.userCtx.name};
    return __localSessionCache.username;
  })
}

function _nameToHex(name) {
  var hex = '';
  for (var i=0; i<name.length; i++) {
    hex += '' + name.charCodeAt(i).toString(16);
  }
  return hex;
}

function _getUserRemoteDatabase() {
  return getCurrentUsername().then(name => name ? new PouchDB(HOST + 'userdb-' + _nameToHex(name)) : null);
}

function _getUserDatabase() {
  return _getUserRemoteDatabase()
    .then(remoteDB => {
      return getCurrentUsername().then(name => {
        if (!name) {
          return new PouchDB('loggedOutLocal');
        }

        var localDB = new PouchDB('local-' + _nameToHex(name));
        localDB.createIndex({index: {fields: ['type']}});
        localDB.sync(remoteDB, {live: true, retry: true});
        return localDB;
      })
    });
}

const udb = _getUserDatabase;

// v2 client

const V2 = {
  createObject: fields => udb().then(db => db.post(fields)),
  getObjectByID: id => udb().then(db => db.get(id)),

  findObjectsByIDs: ids => udb().then(db => db.allDocs({keys: ids})).then(res => res.rows.map(r => r.doc)),

  findObjects: (query, skip, limit) => udb()
    .then(db => db.find({selector: query, skip: skip, limit: limit}))
    .then(res => res.docs),

  findPagedObjects: (query, pageLimit, pageNo) => udb()
    .then(db => {
      return Promise.all([
        db.find({selector: query, skip: pageNo*pageLimit, limit: pageLimit}),
        db.find({selector: query, fields: ['_id']}),
      ]).then(([objs, cnt]) => ({total: cnt.docs.length, data: objs.docs}));
    }),

  updateObject: (id, updates) => udb().then(db =>
    db.get(id).then(doc => db.put(mergeDict(doc, updates)))
  ),

  updateTypeWithChanges: (id, adds, removes, updates) => {
    return udb().then(db => {
      db.get(id).then(t => {
        if (t.type != PrimType.Type) {
          throw 'Cannot update non type with this function';
        }

        var newT = mergeDict(mergeDict(t, updates), adds);
        removes.forEach(r => {
          delete newT[r];
        });
        return newT;
      }).then(newT => {
        return Promise.all([
          db.put(newT),
          db.find({selector: {type: newT._id}}).then(res =>
            db.bulkDocs(res.docs.map(doc => {
              removes.forEach(r => { delete doc[r] });
              for (var u in updates) { delete doc[u] }
              return doc;
            }))
          ),
        ]);
      }).then(() => {
        // TODO: Add history
      });
    });
  },

  searchObjects: (type, text, skip, limit) => udb().then(db => {
    let pat = new RegExp(text);
    if (!isNaN(type)) {
      type = parseInt(type);
    }

    return db.find({
      selector: {
        type: type,
        $or: [
          {_id: {$regex: pat}},
          {name: {$regex: pat}},
          {description: {$regex: pat}},
        ],
      },
      skip: skip,
      limit: limit,
    }).then(res => res.docs);
  }),

  deleteObject: (doc) => udb().then(db =>
    db.remove(doc)
  ),
}

const createObject = V2.createObject;
const getObjectByID = V2.getObjectByID;
const findObjectsByIDs = V2.findObjectsByIDs;
const findObjects = V2.findObjects;
const findPagedObjects = V2.findPagedObjects;
const updateObject = V2.updateObject;
const updateTypeWithChanges = V2.updateTypeWithChanges;
const searchObjects = V2.searchObjects;
const deleteObject = V2.deleteObject;

export {
  V2,
  createObject,
  getObjectByID,
  findObjectsByIDs,
  findObjects,
  findPagedObjects,
  updateObject,
  updateTypeWithChanges,
  searchObjects,
  deleteObject,
}

// v1 client

//export function createObject(fields) {
//  return axios.put('/v1/objects/', fields).then(res => res.data);
//}
//
//export function getObjectByID(id) {
//  return axios.get(`/v1/objects/${id}`).then(res => res.data);
//}
//
//export function updateObject(id, newValue) {
//  return axios.post(`/v1/objects/${id}`, newValue).then(res => res.data);
//}
//
//export function updateTypeWithChanges(id, adds, removes, updates) {
//  return axios.post(`/v1/types/${id}/changes`, {adds, removes, updates}).then(res => res.data);
//}
//
//export function findObjectsByIDs(ids) {
//  return axios.get(`/v1/objects/multiID`, {
//    params: {ids: JSON.stringify(ids)}
//  }).then(res => res.data);
//}
//
//export function findObjects(query, skip, limit) {
//  return axios.get('/v1/objects', {
//	  params: {
//      query: JSON.stringify(query),
//	    skip: skip,
//	    limit: limit,
//	  },
//  }).then(res => res.data);
//}
//
//export function findPagedObjects(query, pageLimit, pageNo) {
//  return axios.get('/v1/objects/paged', {
//	  params: {
//      query: JSON.stringify(query),
//	    limit: pageLimit,
//	    page: pageNo,
//	  },
//  }).then(res => res.data);
//}
//
//export function searchObjects(type, text, skip, limit) {
//  return axios.get('/v1/objects/search', {
//    params: {
//      type: type,
//      text: text,
//      skip: skip,
//      limit: limit,
//    },
//  }).then(res => res.data);
//}

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
