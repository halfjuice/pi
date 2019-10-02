const nedb = require('nedb-promises');

const db = nedb.create('./temp/data.nedb');

const Server = {
  createObject: fields => db.insert(fields),
  getObjectByID: id => db.findOne({ _id: id }),
  findObjectsByIDs: ids => Promise.all(ids.map(id => db.findOne({_id: id}))),
  findObjects: (query, skip, limit) => db.find(query).skip(skip).limit(limit),
  searchObjects: (type, text, skip, limit) => {
    let pat = new RegExp(text);
    if (!isNaN(type)) {
      type = parseInt(type);
    }
    return db.find({
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

    app.get('/v1/objects/:id', (req, res) => {
      Server.getObjectByID(req.params.id).then((r, err) => res.send(r));
	  });

    app.get('/v1/objects', (req, res) => {
      Server.findObjects(JSON.parse(req.query.query || '{}'), req.query.skip || 0, req.query.limit || 50).then(docs => res.send(docs));
    });

	  app.put('/v1/objects/', (req, res) => {
	    Server.createObject(req.body).then((r, err) => {
		    res.send(r);
	    });
	  });
  },
};
