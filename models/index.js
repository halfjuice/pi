const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: '../temp/objects.sqlite.db',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const Object = sequelize.define('object', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  type: Sequelize.INTEGER,
  payload: Sequelize.STRING,
});

function serverCreateObject(type) {
  Object.create;
}

function serverGetObjectByID(id) {}

function clientCreateObject(type) {}

function setupServerApp(app) {
  app.get('/v1/object/:id', (_, res) => {
    res.send('dddd');
  });
}

module.exports = {
  serverCreateObject,
  serverGetObjectByID,
  clientCreateObject,
  setupServerApp,
};
