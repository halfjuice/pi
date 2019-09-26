const nedb = require('nedb-promises');

const db = nedb.create('../temp/data.nedb');

const Server = {
  createObject: fields => db.insert(fields),
  getObjectByID: id => db.findOne({ _id: id }),
};

module.exports = {
  setupServerApp: app => {
    app.get('/v1/object/:id', (_, res) => {
      res.send('dddd');
    });
    app.put('/v1/objects/', (req, res) => {
      console.log(req.body);
      Server.createObject(JSON.parse(req.body)).then(_, r =>
        res.send(JSON.stringify(r)),
      );
    });
  },
};
