let model = function() {
  this.name = 'model'
}

model.prototype.find = function() {}
model.prototype.findOne = function() {}
model.prototype.findOneAndUpdate = function() {}
model.prototype.remove = function() {}

module.exports = {
  model,
  collection: {
    collectionName: 'Test'
  }
}
