let model = function () {
  this.name = 'model'
}

model.prototype.find = function () {}
model.prototype.findOne = function () {}
model.prototype.remove = function () {}

module.exports = {
  model: model,
  collection: {
    collectionName: 'Test'
  }
}