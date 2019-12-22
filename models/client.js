import axios from 'axios';
import util from 'util';
import { mergeDict, tuples2obj } from '../app/utils/helper';

const HOST = 'https://notely.halfjuice.com:6984/'

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import PouchAuth from 'pouchdb-authentication';
PouchDB.plugin(PouchFind);
PouchDB.plugin(PouchAuth);

export const PrimType = {
  Type: 0,
  // DEPRECATED
  //RelType: 1,
  View: 2,
  History: 3,

  CommunityModel: 200,
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

  // Add logic for disconnected case
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

function _getCommunityRemoteDatabase() {
  var db = new PouchDB(HOST + 'community');
  return Promise.resolve(db);
}

var __localIndexMarker = {};

function _getUserDatabase() {
  return _getUserRemoteDatabase()
    .then(remoteDB => {
      return getCurrentUsername().then(name => {
        if (!name) {
          return new PouchDB('loggedOutLocal');
        }

        var localDB = new PouchDB('local-' + _nameToHex(name));
        if (!__localIndexMarker[name]) {
          localDB.createIndex({index: {fields: ['type']}});
          __localIndexMarker[name] = true;
        }
        localDB.sync(remoteDB, {
          live: true,
          retry: true,
          //batch_size: 512,
          //batches_limit: 32,
        });
        return localDB;
      })
    });
}

// v2 client
const makeInterfaceForDBGen = (udb) => ({
  createObject: fields => udb().then(db => db.post(fields)),
  upsertObject: doc => udb().then(db => db.put(doc)),
  getObjectByID: id => udb().then(db => db.get(id)),

  findObjectsByIDs: ids => udb().then(db => db.allDocs({keys: ids, include_docs: true})).then(res => res.rows.map(r => r.doc)),

  findObjects: (query, skip, limit, sort) => udb()
    .then(db => db.find({selector: query, skip: skip, limit: limit, sort: sort}))
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

  deleteType: (typ) => udb().then(db =>
    db.remove(typ)
      .then(() => db.find({
        selector: {
          type: typ._id,
        },
        fields: ['_id', '_rev'],
      }))
      .then(res => res.docs.map(d => ({...d, _deleted: true})))
      .then(ids => {
        if (!ids || !ids.length) {
          return;
        }
        console.log(ids);
        return db.bulkDocs(ids);
      })
  ),
});

export const {
  createObject,
  upsertObject,
  getObjectByID,
  findObjectsByIDs,
  findObjects,
  findPagedObjects,
  updateObject,
  updateTypeWithChanges,
  searchObjects,
  deleteObject,
  deleteType,
} = makeInterfaceForDBGen(_getUserDatabase);

export const communityDB = makeInterfaceForDBGen(_getCommunityRemoteDatabase);

export const createConsistentUserDB = () => {
  let __db = _getUserDatabase();
  return makeInterfaceForDBGen(() => __db);
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
