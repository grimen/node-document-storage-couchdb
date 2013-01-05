var cradle = require('cradle');

module.exports = {
  get: function(db, type, id, callback) {
    var key = [type, id].join('/');

    var client = new cradle.Connection('localhost', 5984, {
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

    var client = new cradle.Connection('localhost', 5984, {
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

    var client = new cradle.Connection('localhost', 5984, {
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

    var client = new cradle.Connection('localhost', 5984, {
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
};