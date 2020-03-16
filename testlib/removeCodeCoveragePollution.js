/* eslint no-use-before-define: ["error", "nofunc"] */

// @ts-check

const assert = require('assert')

module.exports = removeCodeCoveragePollution

class IstanbulPollutionRemover {
  constructor(functionDefinition) {
    assert(typeof functionDefinition === 'string' && functionDefinition !== '')

    this.func = functionDefinition
    this.result = this.func

    this._determineId()
  }

  _determineId() {
    this.istanbulId = null

    const matchIstanbulStatement = /\/\* istanbul ignore next \*\/([^;]+);/g
    const matchIstanbulIdInsideStatement = /\b(cov_\w+)\(\)/

    for (let i = 0; i < 100; i++) {
      const currentMatch = matchIstanbulStatement.exec(this.func)
      if (currentMatch == null) {
        break
      }

      const currentIdMatch = matchIstanbulIdInsideStatement.exec(currentMatch[1])
      if (currentIdMatch != null) {
        if (this.istanbulId == null) {
          // eslint-disable-next-line prefer-destructuring
          this.istanbulId = currentIdMatch[1]
        } else if (this.istanbulId !== currentIdMatch[1]) {
          this.istanbulId = null
          // eslint-disable-next-line no-console
          console.error('removeCodeCoveragePollution() failed to find unique Istanbul-ID')
          return this
        }
      }
    }

    if (this.istanbulId == null) {
      // eslint-disable-next-line no-console
      console.error('removeCodeCoveragePollution() failed to find Istanbul-ID')
    }

    return this
  }

  removeComments() {
    if (this.istanbulId != null) {
      const matchIstanbulComment = /\n[ \t]+\/\* istanbul ignore next \*\//g

      this.result = this.result.replace(matchIstanbulComment, '')
    }

    return this
  }

  removeSimpleIncrements() {
    if (this.istanbulId != null) {
      const matchSimpleIncrements = new RegExp(
        `\n[ \t]*${this.istanbulId}\\(\\)\\.\\w\\[\\d+\\](\\[\\d+\\])?\\+\\+;[ \t]*`,
        'g'
      )

      this.result = this.result.replace(matchSimpleIncrements, '')
    }

    return this
  }

  removeAssignIncrements() {
    if (this.istanbulId != null) {
      const matchAssignIncrements = new RegExp(`=\\s*\\(${this.istanbulId}[^,]+, *([^;]+);`, 'g')

      this.result = this.result.replace(
        matchAssignIncrements,
        (matchAll, matchP1) => `= ${matchP1.replace(/\)$/, '')};`
      )
    }

    return this
  }

  removeEmptyElseBranches() {
    if (this.istanbulId != null) {
      const matchEmptyElseBranch = / else\s*{\s*}/g
      this.result = this.result.replace(matchEmptyElseBranch, '')
    }

    return this
  }

  removeDoubleEmptyLines() {
    const matchDoubleEmptyLines = /\n\n\n/g
    this.result = this.result.replace(matchDoubleEmptyLines, '\n\n')
  }

  getResult() {
    return this.result
  }
}

function removeCodeCoveragePollution(functionDefinition) {
  const remover = new IstanbulPollutionRemover(functionDefinition)

  remover
    .removeComments()
    .removeSimpleIncrements()
    .removeAssignIncrements()
    .removeEmptyElseBranches()
    .removeDoubleEmptyLines()

  const unpolluted = remover.getResult()

  return unpolluted
}

// Example of an polluted function definition:
//
// async function wrapper(...args) {
//   /* istanbul ignore next */
//   cov_1eyye7brw().f[6]++;
//   let result;
//   const client =
//   /* istanbul ignore next */
//   (cov_1eyye7brw().s[27]++, await getClient());
//
//   /* istanbul ignore next */
//   cov_1eyye7brw().s[28]++;
//
//   try {
//     /* istanbul ignore next */
//     cov_1eyye7brw().s[29]++;
//     result = await this.__proto__[name].apply(this, args);
//
//     /* istanbul ignore next */
//     cov_1eyye7brw().s[30]++;
//
//     if (client.batchSize) {
//       /* istanbul ignore next */
//       cov_1eyye7brw().b[4][0]++;
//       cov_1eyye7brw().s[31]++;
//       result = result.batchSize(client.batchSize);
//     } else
//     /* istanbul ignore next */
//     {
//       cov_1eyye7brw().b[4][1]++;
//     }
//   } catch (error) {
//     /* istanbul ignore next */
//     cov_1eyye7brw().s[32]++;
//     result = handleError(error, client, this, this[name], args);
//   }
//
//   /* istanbul ignore next */
//   cov_1eyye7brw().s[33]++;
//   return result;
// }
