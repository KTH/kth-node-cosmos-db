/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

module.exports = adaptMongooseSchema

const useMongoNative = require('./useMongoNative')
const ValidityUtils = require('./validity')

function adaptMongooseSchema(input) {
  const prefix = 'adaptMongooseSchema()'

  ValidityUtils.ensureValidObject({ input, prefix, text: 'input' })
  const { cosmosClientWrapper, mongooseSchema } = input

  const dontChangeInput = useMongoNative()
  if (dontChangeInput) {
    return mongooseSchema
  }

  ValidityUtils.ensureValidClass({
    input: cosmosClientWrapper,
    prefix,
    text: 'client',
    className: 'CosmosClientWrapper',
  })
  ValidityUtils.ensureValidClass({
    input: mongooseSchema,
    prefix,
    text: 'Mongoose schema',
    className: 'Schema',
  })

  // mongooseSchema.pre('save', prepareSaveAction)
  // mongooseSchema.post('save', checkSaveAction)
  // mongooseSchema.post('save', catchSaveError)

  return mongooseSchema
}

function prepareSaveAction(next) {
  if (this._kthData == null) {
    this._kthData = { count: 0 }
  } else {
    this._kthData.count++
  }
  next()
}

function checkSaveAction(doc, next) {
  delete doc._kthData
  next()
}

async function catchSaveError(error, doc, next) {
  if (error != null && error.code === 16500) {
    // try {
    //   await doc.save()
    // } catch (error2) {
    //   next(new Error(`lexa ${doc._kthData.count} ${error2.message}`))
    // }
    next(new Error(`Azure limited this save action ${this._kthData.count}`))
    return
  }
  next()
}
