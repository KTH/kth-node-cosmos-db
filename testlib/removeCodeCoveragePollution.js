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
    this._prepareMatchIncrementString()
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

  _prepareMatchIncrementString() {
    this.matchIncrementString = null

    if (this.istanbulId != null) {
      this.matchIncrementString = `${this.istanbulId}\\(\\)\\.\\w\\[\\d+\\](?:\\[\\d+\\])?\\+\\+`
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
    if (this.istanbulId != null && this.matchIncrementString != null) {
      // const matchSimpleIncrements = new RegExp(
      //   `\n[ \t]*${this.istanbulId}\\(\\)\\.\\w\\[\\d+\\](\\[\\d+\\])?\\+\\+;[ \t]*`,
      //   'g'
      // )
      const matchSimpleIncrements = new RegExp(`\n[ \t]*${this.matchIncrementString};`, 'g')

      this.result = this.result.replace(matchSimpleIncrements, '')
    }

    return this
  }

  removeIncrementsInBrackets() {
    if (this.istanbulId != null) {
      const linesThatContainIncrementsInBrackets = new RegExp(
        `\n[ \t]*\\(${this.matchIncrementString}, (.+)`,
        'g'
      )

      this.result = this.result.replace(
        linesThatContainIncrementsInBrackets,
        (matchAll, matchP1) => {
          const { inside, after } = this._splitStringOnMainBrackets(`(${matchP1}`)

          return `${inside}${after}`
        }
      )
    }

    return this
  }

  // eslint-disable-next-line class-methods-use-this
  _splitStringOnMainBrackets(input, openingBracketChar = '(', closingBracketChar = ')') {
    const result = {
      before: '',
      inside: '',
      after: ''
    }

    const singleInputChars = Array.from(input)
    let currentPart = 'before'
    let currentBracketDepth = 0

    singleInputChars.forEach(currentChar => {
      if (currentChar === openingBracketChar) {
        currentBracketDepth += 1
        const isOpeningMainBracket = currentPart === 'before'
        if (isOpeningMainBracket) {
          currentPart = 'inside'
          return
        }
      } else if (currentChar === closingBracketChar) {
        currentBracketDepth -= 1
        const isClosingMainBracket = currentPart === 'inside' && currentBracketDepth === 0
        if (isClosingMainBracket) {
          currentPart = 'after'
          return
        }
      }

      result[currentPart] += currentChar
    })

    return result
  }

  removeEmptyElseBranches() {
    if (this.istanbulId != null) {
      const matchEmptyElseBranch = / else\s*{\s*}/g
      this.result = this.result.replace(matchEmptyElseBranch, '')
    }

    return this
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
    .removeIncrementsInBrackets()
    .removeEmptyElseBranches()

  const unpolluted = remover.getResult()

  return unpolluted
}

// Example of an polluted function definition:
//
// async function wrapper(...args) {
//   /* istanbul ignore next */
//   cov_1teyyrk63d().f[7]++;
//   let result;
//   const methodPrototype =
//   /* istanbul ignore next */
//   (cov_1teyyrk63d().s[33]++, Object.getPrototypeOf(this)[name]);
//   const client =
//   /* istanbul ignore next */
//   (cov_1teyyrk63d().s[34]++, await getClient());
//   const method =
//   /* istanbul ignore next */
//   (cov_1teyyrk63d().s[35]++, this[name]);
//
//   /* istanbul ignore next */
//   cov_1teyyrk63d().s[36]++;
//
//   try {
//     const query =
//     /* istanbul ignore next */
//     (cov_1teyyrk63d().s[37]++, methodPrototype.apply(this, args));
//
//     /* istanbul ignore next */
//     cov_1teyyrk63d().s[38]++;
//
//     if (
//     /* istanbul ignore next */
//     (cov_1teyyrk63d().b[6][0]++, client != null) &&
//     /* istanbul ignore next */
//     (cov_1teyyrk63d().b[6][1]++, client.batchSize)) {
//       /* istanbul ignore next */
//       cov_1teyyrk63d().b[5][0]++;
//       cov_1teyyrk63d().s[39]++;
//       query.batchSize(client.batchSize);
//     } else
//     /* istanbul ignore next */
//     {
//       cov_1teyyrk63d().b[5][1]++;
//     }
//
//     cov_1teyyrk63d().s[40]++;
//     result = await query;
//   } catch (error) {
//     /* istanbul ignore next */
//     cov_1teyyrk63d().s[41]++;
//     result = handleError(error, client, this, method, args);
//   }
//
//   /* istanbul ignore next */
//   cov_1teyyrk63d().s[42]++;
//   return result;
// }
