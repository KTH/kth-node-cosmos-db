const DocumentClient = function(url, opts) {
  this.masterKey = opts.masterKey
}

DocumentClient.prototype.readDatabase = (url, cb) => {
  return cb(undefined, {})
}

DocumentClient.prototype.createDatabase = (url, cb) => {
  return cb(undefined, {})
}

DocumentClient.prototype.readCollection = (url, cb) => {
  return cb(undefined, {})
}

DocumentClient.prototype.createCollection = (url, id, offer, cb) => {
  return cb(undefined, {})
}

DocumentClient.prototype.replaceOffer = (url, offer, cb) => {
  return cb(undefined, { content: { offerThroughput: 400 } })
}

DocumentClient.prototype.queryOffers = () => {
  return {
    toArray: cb => cb(undefined, [{ content: { offerThroughput: 400 } }])
  }
}

module.exports = {
  DocumentClient
}
