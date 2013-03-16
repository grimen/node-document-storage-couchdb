
// -----------------------
//  Test
// --------------------

var Storage = require('node-document-storage');

module.exports = Storage.Spec('CouchDB', {
  module: require('..'),
  engine: require('cradle'),
  id: 'couchdb',
  protocol: 'http',
  db: 'default-test',
  default_url: 'http://localhost:5984/default-test',
  authorized_url: 'https://app9156953.heroku:X8763MJCEGurRpOpmGEYlbyk@app9156953.heroku.cloudant.com/test',
  unauthorized_url: 'https://app9156953.heroku:123@app9156953.heroku.cloudant.com/test',
  client: {
    get: function(db, type, id, callback) {
      var key = [type, id].join('/');

      var client = new (require('cradle')).Connection('localhost', 5984, {
        cache: true,
        raw: false
      });

      db = client.database(db);

      db.create(function(err) {
        db.get(key, function(err, res) {
          callback(err, res || null);
        });
      });
    },

    set: function(db, type, id, data, callback) {
      var key = [type, id].join('/');

      var client = new (require('cradle')).Connection('localhost', 5984, {
        cache: true,
        raw: false
      });

      db = client.database(db);

      db.create(function(res) {
        db.save(key, data, function(err, res) {
          callback(err, res || null);
        });
      });
    },

    del: function(db, type, id, callback) {
      var key = [type, id].join('/');

      var client = new (require('cradle')).Connection('localhost', 5984, {
        cache: true,
        raw: false
      });

      db = client.database(db);

      db.create(function(res) {
        db.get(key, function(err, res) {
          db.remove(key, function(err, res) {
            callback(err, res || null);
          });
        });
      });
    },

    exists: function(db, type, id, callback) {
      var key = [type, id].join('/');

      var client = new (require('cradle')).Connection('localhost', 5984, {
        cache: true,
        raw: false
      });

      db = client.database(db);

      db.create(function(err) {
        db.get(key, function(err, res) {
          callback(err, res || null);
        });
      });
    }
  }
});
