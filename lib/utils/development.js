module.exports._development = env => {
  return env.NODE_ENV === 'development' && env.USE_COSMOS_DB !== 'true'
}
