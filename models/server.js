const nedb = require('nedb-promises');

// TODO: Ability to switch DB
// TODO: Enter test mode will use test db, which can be re-written easily
const h = require('./serverHandle');
const db = h.db;

const Server = {
  createObject: fields => h.insert(fields),
  getObjectByID: id => db().findOne({ _id: id }),
  findObjectsByIDs: ids => Promise.all(ids.map(id => db().findOne({_id: id}))),
  findObjects: (query, skip, limit) => db().find(query).skip(skip).limit(limit),
  findPagedObjects: (query, pageLimit, pageNo) => Promise.all([
    db().find(query).skip(pageNo*pageLimit).limit(pageLimit),
    db().count(query),
  ]).then(([objs, cnt]) => ({total: cnt, data: objs})),
  updateObject: (id, updates) => h.updateObject(id, updates),
  updateTypeWithChanges: (id, adds, removes, updates) => h.updateTypeWithChanges(id, adds, removes, updates),
  searchObjects: (type, text, skip, limit) => {
    let pat = new RegExp(text);
    if (!isNaN(type)) {
      type = parseInt(type);
    }
    if (!text) {
      return db().find({type: type}).skip(skip).limit(limit);
    }

    return db().find({
      type: type,
      $or: [
        {_id: {$regex: pat}},
        {name: {$regex: pat}},
        {description: {$regex: pat}},
      ],
    }).skip(skip).limit(limit);
  },
};

module.exports = {
  setupServerApp: app => {
	  app.get('/v1/test', (req, res) => {
	    res.send('hello');
	  });

    app.get('/v1/objects/multiID', (req, res) => {
      Server.findObjectsByIDs(JSON.parse(req.query.ids)).then(docs => res.send(docs));
    });

    app.get('/v1/objects/search', (req, res) => {
      Server.searchObjects(req.query.type, req.query.text, req.query.skip || 0, req.query.limit || 50).then(docs => res.send(docs));
    });

    app.get('/v1/objects/paged', (req, res) => {
      Server.findPagedObjects(JSON.parse(req.query.query || '{}'), req.query.limit || 0, req.query.page || 50).then(docs => {
        res.send(docs);
      });
    });

    app.get('/v1/objects/:id', (req, res) => {
      Server.getObjectByID(req.params.id).then((r, err) => {
        if (!r) {
          res.status(404).send(null);
        } else {
          res.send(r)
        }
      });
	  });

    app.get('/v1/objects', (req, res) => {
      Server.findObjects(JSON.parse(req.query.query || '{}'), req.query.skip || 0, req.query.limit || 50).then(docs => res.send(docs));
    });

    app.post('/v1/objects/:id', (req, res) => {
      Server.updateObject(req.params.id, req.body).then((r, err) => {
        res.send(r);
      });
    });

    app.post('/v1/types/:id/changes', (req, res) => {
      Server.updateTypeWithChanges(req.params.id, req.body.adds, req.body.removes, req.body.updates).then((r, err) => {
        res.send({count: r});
      });
    });

	  app.put('/v1/objects/', (req, res) => {
	    Server.createObject(req.body).then((r, err) => {
		    res.send(r);
	    });
	  });
  },
};
