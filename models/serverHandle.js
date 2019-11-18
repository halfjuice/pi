const nedb = require('nedb-promises');

PrimType = {
  Type: 0,
  // DEPRECATED
  //RelType: 1,
  View: 2,
  History: 3,
}

HistoryType = {
  Update: 'update',
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

  updateObjectWithDiff: (id, diffs) => {

  },

  updateObject: (id, newValue) => {
    return ServerHandle.getObjectByID(id).then(obj => {
      if (obj.type == PrimType.Type || obj.type == PrimType.History) {
        throw Error.UpdateDirectlyNotSupported;
      }

      // TODO: Check for view update
      if (obj.type == PrimType.View) {

      }

      // TODO: Check for legal object
      return db().update({_id: id}, {$set: newValue}).then(() => {
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
