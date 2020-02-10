const {parseComponentEmail} = require('./parse-component-email.js')

test('parses a single tag by name', function() {
  expect(parseComponentEmail('foo:bar', 'foo')).toBe('bar')
})

test('parses a not-last tag by name', function() {
  expect(parseComponentEmail('foo:bar,baz:bat', 'foo')).toBe('bar')
})

test('parses a not-first tag by name', function() {
  expect(parseComponentEmail('foo:bar,baz:bat', 'baz')).toBe('bat')
})

test('un-cleanses DataDog tags', function() {
  const cleansed = 'component_xyz_notifications.statuspage.io'
  const expected = 'component+xyz@notifications.statuspage.io'
  expect(parseComponentEmail(`email:${cleansed}`, 'email')).toBe(expected)
})
