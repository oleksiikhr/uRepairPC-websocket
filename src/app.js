'use strict'

/*
 * Require
 */
const awaitRequest = require('./helper/await-request')
const server = require('http').createServer()
const io = require('socket.io')(server)
const Redis = require('ioredis')
const env = require('./env')

/*
 * Variables
 */
const redis = new Redis
const sockets = {}

// redis.psubscribe('*')
// redis.on('pmessage', (channel, pattern, message) => {
//   console.log(channel, pattern, message)
//   message = JSON.parse(message)
//   io.emit(pattern + ':' + message.event, message.data)
// })

io.on('connection', (socket) => {
	console.log('Connection', socket.id)

	socket.on('disconnect', () => {
		console.log('Disconnect', socket.id)
	})
})

server.listen(env.port, () => {
	console.log(`Listening on *:${env.port}`)
})
