/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const { Mongoose } = require('../../test/lib')

module.exports = {
  listOverloadedMethods,
  getPreparedTestModel,
  getTestDataAboutOverloadedMethods,
}

const Global = {
  definition: {
    name: String,
    age: Number,
  },
  template: {
    name: 'testName',
    age: 5,
  },
}

function listOverloadedMethods() {
  const sortedMethodList = [
    'find',
    'findById',
    'findOne',
    'findOneAndUpdate',
    'remove',
    // 'save',
    'update',
    'updateMany',
    'updateOne',
  ]

  return sortedMethodList
}

async function getPreparedTestModel() {
  const { definition, template } = Global
  const Model = await Mongoose.getTestModel(3, { definition, template })
  return Model
}

function getTestDataAboutOverloadedMethods() {
  const overloadedMethods = []

  overloadedMethods.push({
    name: 'find',
    args: [],
    check: result => {
      expect(result).toBeArrayOfSize(3)
      result.forEach(item => {
        expect(item).toBeObject()
        _expectObjectId(item._id)
        expect(item.name).toEqual(Global.template.name)
        expect(item.age).toEqual(Global.template.age)
      })
    },
  })

  overloadedMethods.push({
    name: 'findById',
    args: [Mongoose.getTestObjectId()],
    check: result => {
      expect(result).toBe(null)
    },
  })

  overloadedMethods.push({
    name: 'findOne',
    args: [{}],
    check: result => {
      expect(result).toBeObject()
      _expectObjectId(result._id)
      expect(result.name).toBe(Global.template.name)
      expect(result.age).toBe(Global.template.age)
    },
  })

  overloadedMethods.push({
    name: 'findOneAndUpdate',
    args: [{}, { $set: { name: 'otherTestName' } }, { new: true }, () => {}],
    check: result => {
      expect(result).toBeObject()
      _expectObjectId(result._id)
      expect(result.name).toBe('otherTestName')
      expect(result.age).toBe(Global.template.age)
    },
  })

  overloadedMethods.push({
    name: 'remove',
    args: [{}],
    check: result => {
      expect(result).toEqual({ ok: 1, n: 3, deletedCount: 3 })
    },
  })

  overloadedMethods.push({
    name: 'update',
    args: [{ name: 'testName' }, { name: 'updated testName' }],
    check: result => {
      expect(result).toEqual({ ok: 1, n: 1, nModified: 1 })
    },
  })

  overloadedMethods.push({
    name: 'updateMany',
    args: [{ name: 'testName' }, { name: 'updated testName' }],
    check: result => {
      expect(result).toEqual({ ok: 1, n: 3, nModified: 3 })
    },
  })

  overloadedMethods.push({
    name: 'updateOne',
    args: [{ name: 'testName' }, { name: 'updated testName' }],
    check: result => {
      expect(result).toEqual({ ok: 1, n: 1, nModified: 1 })
    },
  })

  // overloadedMethods.push({
  //   name: 'save',
  //   callOnInstance: true,
  //   args: [],
  //   check: result => {
  //     expect(result).toBeObject()
  //     _expectObjectId(result._id)
  //   },
  // })

  return overloadedMethods
}

function _expectObjectId(id) {
  expect(id).toBeObject()
  expect(id.toString()).toMatch(/^\w{24}$/)
}
