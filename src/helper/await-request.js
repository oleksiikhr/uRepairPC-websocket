'use strict'

const request = require('request')

/**
 * @see https://stackoverflow.com/a/40552394/9612245
 */
module.exports = async (value) =>
  new Promise((resolve, reject) => {
    request(value, (error, response, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
