const assert = require('assert')
const {parseComponentEmail} = require('./parse-component-email.js')

describe('parseComponentEmail', function() {
  it('parses a single tag by name', function() {
    assert.equal(parseComponentEmail('foo:bar', 'foo'), 'bar')
  })

  it('parses a not-last tag by name', function() {
    assert.equal(parseComponentEmail('foo:bar,baz:bat', 'foo'), 'bar')
  })

  it('parses a not-first tag by name', function() {
    assert.equal(parseComponentEmail('foo:bar,baz:bat', 'baz'), 'bat')
  })

  it('un-cleanses DataDog tags', function() {
    const cleansed = 'component_xyz_notifications.statuspage.io'
    const expected = 'component+xyz@notifications.statuspage.io'
    assert.equal(parseComponentEmail(`email:${cleansed}`, 'email'), expected)
  })
})
