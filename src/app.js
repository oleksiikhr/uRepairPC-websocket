'use strict'

/*
 * Require
 */
const awaitRequest = require('./helper/await-request')
const server = require('http').createServer()
const io = require('socket.io')(server)
const Redis = require('ioredis')
const path = require('path')
const env = require('./env')

/*
 * Variables
 */
const redis = new Redis
const sockets = {}

redis.psubscribe('server.*')
redis.on('pmessage', (channel, pattern, message) => {
  console.log(channel, pattern, message)

	try {
		message = JSON.parse(message)
	} catch (e) {
		return
	}

	switch (message.event) {
	case `App${path.sep}Events${path.sep}Users${path.sep}Edit`:
		sockets[message.data.from_id].socket
			.to('users')
			.emit(`users-${message.data.id}`, {
				action: 'update',
				detail: message.data.detail,
				from_id: message.data.from_id
			})
		break
	}
})

io.on('connection', (socket) => {
	console.log('Connection', socket.id)

	// FIXME fill on user Auth (permissions)
	socket.join('users')

	// TODO Auth
	socket.on('auth', () => {
		console.log('Auth')

		// Check user from server
		// FIXME 1 - example userId
		sockets[1] = { socket }
	})

	socket.on('disconnect', () => {
		console.log('Disconnect', socket.id)
		// FIXME
		delete sockets[1]
	})
})

server.listen(env.port, () => {
	console.log(`Listening on *:${env.port}`)
})
