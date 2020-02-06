const assert = require('assert')
const {parseComponentState} = require('./parse-component-state.js')

describe('parseComponentState', function() {
  it('finds UP anywhere in message', function() {
    assert.equal(parseComponentState('Way UP there'), 'UP')
  })

  it('finds DOWN anywhere in message', function() {
    assert.equal(parseComponentState('Hey DOWN there'), 'DOWN')
  })

  it('avoids false positives', function() {
    assert.equal(parseComponentState('UPWARDS!'), null)
    assert.equal(parseComponentState('HOEDOWN'), null)
    assert.equal(parseComponentState('We up all night'), null)
    assert.equal(parseComponentState('down the way'), null)
  })
})
