'use strict'

exports.parseComponentState = message => {
  const match = (message || '').match(/\b(UP|DOWN)\b/)
  return match && match[0]
}
