const {parseComponentState} = require('./parse-component-state.js')

test('finds UP anywhere in message', function() {
  expect(parseComponentState('Way UP there')).toBe('UP')
})

test('finds DOWN anywhere in message', function() {
  expect(parseComponentState('Hey DOWN there')).toBe('DOWN')
})

test('avoids false positives', function() {
  expect(parseComponentState('UPWARDS!')).toBeNull()
  expect(parseComponentState('HOEDOWN')).toBeNull()
  expect(parseComponentState('We up all night')).toBeNull()
  expect(parseComponentState('down the way')).toBeNull()
})
