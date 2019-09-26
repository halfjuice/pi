const nedb = require('nedb-promises');

const db = nedb.create('../temp/data.nedb');

const Server = {
  createObject: fields => db.insert(fields),
  getObjectByID: id => db.findOne({ _id: id }),
};

module.exports = {
    setupServerApp: app => {
	app.get('/v1/test', (req, res) => {
	    res.send('hello');
	});
	app.get('/v1/objects/:id', (req, res) => {
	    res.send('dddd');
	});
	app.put('/v1/objects/', (req, res) => {
	    Server.createObject(req.body).then((r, err) => {
		res.send(r);
	    });
	});
    },
};
