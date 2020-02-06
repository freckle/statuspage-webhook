'use strict'

var aws = require('aws-sdk')
var ses = new aws.SES({region: 'us-east-1'})

exports.sendEmail = async options => {
  const params = {
    Destination: {ToAddresses: [options.to]},
    Message: {Body: {Text: {Data: ''}}, Subject: {Data: options.subject}},
    Source: options.from
  }

  return ses.sendEmail(params).promise()
}
