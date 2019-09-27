const nedb = require('nedb-promises');

const db = nedb.create('../temp/data.nedb');

const Server = {
  createObject: fields => db.insert(fields),
  getObjectByID: id => db.findOne({ _id: id }),
  findObjects: (query, skip, limit) => db.find(query).skip(skip).limit(limit),
};

module.exports = {
  setupServerApp: app => {
	  app.get('/v1/test', (req, res) => {
	    res.send('hello');
	  });

    app.get('/v1/objects/:id', (req, res) => {
      Server.getObjectById(req.params.id).then((r, err) => res.send(r));
	  });

    app.get('/v1/objects', (req, res) => {
      Server.findObjects(JSON.parse(req.query.query || '{}'), req.query.skip || 0, req.query.limit || 50).then((docs, err) => res.send(docs));
    });

	  app.put('/v1/objects/', (req, res) => {
	    Server.createObject(req.body).then((r, err) => {
		    res.send(r);
	    });
	  });
  },
};
