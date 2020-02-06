'use strict'

const {parseComponentEmail} = require('../lib/parse-component-email.js')
const {parseComponentState} = require('../lib/parse-component-state.js')
const {sendEmail} = require('../lib/send-email.js')

const FROM_ADDRESS = 'statuspage-webhook@freckle.com'
const COMPONENT_EMAIL_TAG = 'statuspage-component-email'

exports.handler = async event => {
  const body = JSON.parse(event.body || '{}')
  const state = parseComponentState(body.message)
  const email = parseComponentEmail(body.tags, COMPONENT_EMAIL_TAG)

  if (!state || !email) {
    console.log('No parse', event)
    console.log('event.body', event.body)
    console.log('state', state)
    console.log('email', email)

    return {
      statusCode: 200,
      headers: {},
      body: 'Component not updated. State or component not found in payload.\n'
    }
  }

  await sendEmail({from: FROM_ADDRESS, to: email, subject: state})

  return {
    statusCode: 200,
    headers: {},
    body: `Updated ${email} to ${state}.\n`
  }
}
