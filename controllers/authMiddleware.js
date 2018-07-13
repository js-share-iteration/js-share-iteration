const pg = require('pg');

module.exports = function (pool) {
  return {
    requireLogin: (req, res, next) => {
      if (!req.user)
        return res.status(401).send({error: 'Not logged in.'});

      next();
    },
    requirePermissions: (req, res, next) => {
      const doc_id = req.params.id || res.locals.doc_id || req.body.doc_id;
      
      console.log(doc_id);
      // is this our own document?
      const queryText = 'select documents.doc_id from documents inner join users on users.id=documents.owner where documents.doc_id=$1 and users.id=$2';
      const data = [doc_id, req.user.id];
      pool.query(queryText, data).then(result => {
        // notify that this is our own file
        if (result.rows.length === 1) {
          console.log('this is our own document');
          
          res.locals.ownFile = true;
          return;
        }
        
        // is this document shared to us by someone else?
        const queryText = 'select documents.doc_id from documents inner join document_permissions on document_permissions.doc_id=documents.doc_id where document_permissions.doc_id=$1 and document_permissions.permitted_user=$2';
        const data = [doc_id, req.user.email];
        return pool.query(queryText, data);
      }).then(result => {
        // this is indeed our own file
        if (res.locals.ownFile) return next();
        
        // we haven't been shared this document
        if (result.rows.length === 0)
          return res.status(401).send({error: 'Not permitted to access file.'});
        
        // we have been shared this document
        console.log('we have been shared this document');
        next();
      });
    }
  };
}


