'use strict'

/*
 * Import
 */
const awaitRequest = require('./helper/await-request')
const server = require('http').createServer()
const config = require('./config/index')
const io = require('socket.io')(server)
const port = process.env.port || 3000
const Redis = require('ioredis')
const redis = new Redis()

/*
 * Variables
 */
const sockets = {}

/*
 * Authorization
 */
require('socketio-auth')(io, {
  async authenticate(socket, data, callback) {
    /** @var type - pc, user, etc */
    const { type, id, token } = data

    // Data is empty
    if (!type || !id || !token) {
      return callback(new Error('Data is not provided'))
    }

    // Make sync request
    let res = null

    try {
      res = await awaitRequest({
        method: 'POST',
        uri: config.URL_AUTH + type,
        form: { id, token }
      })
    } catch (e) {
      return callback(new Error(e))
    }

    // Check answer from server
    // return object - { success - is true }
    if (res) {
      try {
        const dataParsed = JSON.parse(res)

        if (dataParsed.success) {
          socket.join(type) // Join to room
          redis.publish('last_seen.now', JSON.stringify({ type, id }))
          sockets[socket.id] = { id, type }
          return callback(null, true)
        }

        return callback(new Error('Input data is not valid'))

      } catch (e) {
        return callback(new Error(e))
      }
    }

    return callback(new Error('Authenticate is failed'))
  }
})

// redis.psubscribe('*')
// redis.on('pmessage', (channel, pattern, message) => {
//   console.log(channel, pattern, message)
//   message = JSON.parse(message)
//   io.emit(pattern + ':' + message.event, message.data)
// })

io.on('connection', (socket) => {
  console.log('Connection', socket.id)

  // Set last_seen to user/pc.
  socket.on('disconnect', () => {
    console.log('Disconnect')

    const { id, type } = sockets[socket.id]
    redis.publish('last_seen.now', JSON.stringify({ type, id }))
    delete sockets[socket.id]
  })
})

server.listen(port, () => {
  console.log(`Listening on *:${port}`)
})
