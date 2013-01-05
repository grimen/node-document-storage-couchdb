require('sugar')
var fun = require('funargs'),
    util = require('util');

// HACK: ...until Node.js `require` supports `instanceof` on modules loaded more than once. (bug in Node.js)
var Storage = global.NodeDocumentStorage || (global.NodeDocumentStorage = require('node-document-storage'));

// -----------------------
//  DOCS
// --------------------
//  - https://github.com/cloudhead/cradle

// -----------------------
//  Constructor
// --------------------

// new CouchDB ();
// new CouchDB (options);
// new CouchDB (url);
// new CouchDB (url, options);
function CouchDB () {
  var self = this;

  self.klass = CouchDB;
  self.klass.super_.apply(self, arguments);

  self.options.server.db = self.options.server.db.replace(/^\//, '');

  if (self.options.server.protocol === 'https') {
    self.options.server.port = self.options.server.port || 443;
    self.options.server.secure = true;
  }

  if (self.options.server.username || self.options.server.password) {
    self.options.client.auth = {
      username: self.options.server.username,
      password: self.options.server.password
    };
  }
}

util.inherits(CouchDB, Storage);

// -----------------------
//  Class
// --------------------

CouchDB.defaults = {
  url: process.env.COUCHDB_URL || 'http://localhost:5984/{db}-{env}'.assign({db: 'default', env: (process.env.NODE_ENV || 'development')}),
  options: {
    client: {
      cache: true,
      raw: false
    }
  }
};

CouchDB.url = CouchDB.defaults.url;
CouchDB.options = CouchDB.defaults.options;

CouchDB.reset = Storage.reset;

// -----------------------
//  Instance
// --------------------

// #connect ()
CouchDB.prototype.connect = function() {
  var self = this;

  self._connect(function() {
    var cradle = require('cradle');

    self.client = new cradle.Connection(self.options.server.hostname, self.options.server.port, self.options.client);

    var db = self.client.database(self.options.server.db);

    db.create(function() {
      db.save('node-document-auth', {}, function (err) {
        self.emit('ready', err);
      });
    });
  });
};

// #key (key)
CouchDB.prototype.key = function(key) {
  var self = this;
  return key;
};

// #set (key, value, [options], callback)
// #set (keys, values, [options], callback)
CouchDB.prototype.set = function() {
  var self = this;

  // TODO: Use the Bulk API: https://github.com/cloudhead/cradle

  self._set(arguments, function(key_values, options, done, next) {
    var db = self.client.database(self.options.server.db);

    key_values.each(function(key, value) {
      db.save(key, value, function(error, response) {
        if (error && error.error === 'not_found') {
          error = null;
        }

        next(key, error, !error, response);
      });
    });
  });
};

// #get (key, [options], callback)
// #get (keys, [options], callback)
CouchDB.prototype.get = function() {
  var self = this;

  // TODO: Use the Bulk API: https://github.com/cloudhead/cradle

  self._get(arguments, function(keys, options, done, next) {
    var db = self.client.database(self.options.server.db);

    keys.each(function(key) {
      db.get(key, function(error, response) {
        if (error && error.error === 'not_found') {
          error = null;
          response = null;
        }

        next(key, error, response, response);
      });
    });
  });
};

// #del (key, [options], callback)
// #del (keys, [options], callback)
CouchDB.prototype.del = function() {
  var self = this;

  // TODO: Use the Bulk API: https://github.com/cloudhead/cradle

  self._del(arguments, function(keys, options, done, next) {
    var db = self.client.database(self.options.server.db);

    keys.each(function(key) {
      db.get(key, function(get_error, get_response) {
        if (get_error && get_error.error === 'not_found') {
          next(key, get_error, false, null);
          return;
        }

        db.remove(key, function(error, response) {
          next(key, error, !!response, response);
        });
      });
    });
  });
};

// #exists (key, [options], callback)
// #exists (keys, [options], callback)
CouchDB.prototype.exists = function() {
  var self = this;

  self._exists(arguments, function(keys, options, done, next) {
    var db = self.client.database(self.options.server.db);

    keys.each(function(key) {
      db.get(key, function(error, response) {
        if (error && error.error === 'not_found') {
          error = null;
          response = null;
        }

        next(key, error, !!response, response);
      });
    });
  });
};

// -----------------------
//  Export
// --------------------

module.exports = CouchDB;
