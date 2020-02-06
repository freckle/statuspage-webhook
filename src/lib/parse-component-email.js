'use strict'

function uncleanseTag(tag) {
  return tag
    .replace('component_', 'component+')
    .replace('_notifications', '@notifications')
}

exports.parseComponentEmail = (tags, key) => {
  const regex = new RegExp(`(^|,)${key}:([^,]*)(,|$)`)
  const match = (tags || '').match(regex)
  return match && uncleanseTag(match[2])
}
