
function serverCreateObject(type) {
  
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
