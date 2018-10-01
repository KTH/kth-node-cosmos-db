var DocumentClient = function (url, opts) {
  this.masterKey = opts.masterKey
}

DocumentClient.prototype.readDatabase = function (url, cb) {
  return cb(undefined, {})
}
DocumentClient.prototype.createDatabase = function (url, cb) {
  return cb(undefined, {})
}
DocumentClient.prototype.readCollection = function (url, cb) {
  return cb(undefined, {})
}
DocumentClient.prototype.createCollection = function (url, id, offer, cb) {
  return cb(undefined, {})
}
DocumentClient.prototype.replaceOffer = function (url, offer, db) {
  return cb(undefined, {})
}
DocumentClient.prototype.queryOffers = function () {}

module.exports = {
  DocumentClient: DocumentClient
}