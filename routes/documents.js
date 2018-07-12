// middleware
const dbController = require('../controllers/dbController');
const authMiddleware = require('../controllers/authMiddleware');


module.exports = (app, pool) => {
  // define document routes here...
  app.post(
    '/api/createdoc',
    authMiddleware(pool).requireLogin,
    dbController(pool).createDoc,
    dbController(pool).createFile,
    dbController(pool).addPermittedUsers,
    (req, res) => {
      res.send({ doc_id: res.locals.doc_id });
    }
  );

  app.post(
    '/api/docSettings',
    authMiddleware(pool).requireLogin,
    authMiddleware(pool).requirePermissions,
    dbController(pool).editDocTitle,
    dbController(pool).deletePermittedUsers,
    dbController(pool).addPermittedUsers,
    (req, res) => {
      res.send('Document settings updated!');
    }
  );

  // GET Request - docTitle and sharedUsers
  app.get(
    '/api/docSettings/:id',
    authMiddleware(pool).requireLogin,
    authMiddleware(pool).requirePermissions,
    dbController(pool).getDocTitle,
    dbController(pool).getPermittedUsers,
    (req, res) => {
      res.send(res.locals.formInfo);
    }
  );

  app.get(
    '/api/getdocuments',
    authMiddleware(pool).requireLogin,
    dbController(pool).getMyDocs,
    dbController(pool).getPermittedDocs,
    (req, res) => {
      res.send(res.locals.docs);
    }
  );

  // GET Request - getting data from id
  app.get('/api/document/:id', authMiddleware(pool).requireLogin, authMiddleware(pool).requirePermissions,
  dbController(pool).getDocFiles, (req, res) => {
    console.log('​module.exports -> res.locals.result', res.locals);
    res.send(res.locals.result);
  });

  // PUT req - save file content and update last_updated
  app.put('/api/document/:id', authMiddleware(pool).requireLogin, authMiddleware(pool).requirePermissions,
  dbController(pool).saveDocumentContent, (req, res) => {
    res.send('Files successfully saved!');
  });
};


