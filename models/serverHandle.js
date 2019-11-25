const nedb = require('nedb-promises');
const { mergeDict, tuples2obj } = require('../app/utils/helper');

PrimType = {
  Type: 0,
  // DEPRECATED
  //RelType: 1,
  View: 2,
  History: 3,
}

HistoryType = {
  Update: 'update',
  UpdateWithChanges: 'updateWithChanges',
}

DiffType = {
  ChangeField: 'change_field',
  CreateField: 'create_field',
  RemoveField: 'remove_field',
}

const __db = nedb.create('./temp/data.nedb');

const db = () => __db;

const ErrorObject = (code) => {

}
const Error = {
  UpdateDirectlyNotSupported: ErrorObject(1),
}

ServerHandle = {
  db: db,

  getObjectByID: (id) => db().findOne({_id: id}),

  updateTypeWithChanges: (id, adds, removes, updates) => {
    removes = tuples2obj(removes.map(e => [e, true]));
    return db().update({_id: id}, {$set: mergeDict(adds, updates), $unset: removes}).then(() => {
      // Only removes and updates needs to be updated
      // BULK OPERATION!
      return db().update({type: id}, {$unset: mergeDict(removes, updates)}).then(res => {
        db().insert({
          type: PrimType.History,
          historyType: HistoryType.UpdateWithChanges,
          target: id,
          adds: adds,
          removes: removes,
          updates: updates,
        });
        return res;
      });
    });
  },

  updateObject: (id, updates) => {
    return ServerHandle.getObjectByID(id).then(obj => {
      if (obj.type == PrimType.Type || obj.type == PrimType.History) {
        throw Error.UpdateDirectlyNotSupported;
      }

      // TODO: Check for view update
      if (obj.type == PrimType.View) {

      }

      // TODO: Check for legal object
      return db().update({_id: id}, {$set: updates}).then(() => {
        db().insert({
          type: PrimType.History,
          historyType: HistoryType.Update,
          target: id,
          oldValue: obj,
          newValue: newValue,
        });
      });
    })
  },
}

module.exports = ServerHandle;
