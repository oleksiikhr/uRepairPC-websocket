/* | -----------------------------------------------------------------------------------
 * | - import -
 * | -----------------------------------------------------------------------------------
 */
import http from 'http';
import Redis from 'ioredis';
import socketIO from 'socket.io';
import * as env from './env';
import allTypes, * as type from './helper/types';

/* | -----------------------------------------------------------------------------------
 * | - Variables -
 * | -----------------------------------------------------------------------------------
 */
const redis = new Redis();
const server = http.createServer();
const io = socketIO(server);

/* | -----------------------------------------------------------------------------------
 * | - Listen all server.* event from Redis -
 * | -----------------------------------------------------------------------------------
 */
redis.psubscribe('server.*');
redis.on('pmessage', (channel, pattern, message) => {
  /*
   * Get data from laravel and validate to right structure
   */
  try {
    message = JSON.parse(message).data;

    if (!message.event) {
      throw new Error('Event is empty');
    }

    if (typeof message.data === 'undefined') {
      throw new Error('Data is undefined');
    }

    if (typeof message.rooms === 'undefined') {
      throw new Error('Rooms is empty');
    }

    if (!allTypes.includes(message.type)) {
      throw new Error('Type is invalid');
    }

    if (!message.socketId) {
      throw new Error('SocketId is empty');
    }
  } catch (e) {
    console.warn(e);
    return;
  }

  const socket = io.sockets.connected[message.socketId];
  if (typeof socket === 'undefined') {
    return;
  }

  // Get rooms
  let rooms: string[] = [];
  if (Array.isArray(message.rooms)) {
    rooms = message.rooms;
  } else if (message.rooms) {
    rooms = [message.rooms];
  }

  switch (message.type) {
  case type.JOIN:
    rooms.forEach((room) => socket.join(room));
    break;
  case type.SYNC:
    /*
     * Leave the existing rooms that are not found in the array
     * and join the remaining rooms.
     */
    Object.keys(socket.rooms).forEach((room) => {
      if (socket.id !== room) {
        const findRoomIndex = rooms.indexOf(room);
        if (~findRoomIndex) {
          rooms.splice(findRoomIndex, 1);
        } else {
          socket.leave(room);
        }
      }
    });
    rooms.forEach((room) => socket.join(room));
    break;
  case type.CREATE:
  case type.UPDATE:
  case type.DELETE:
    /*
     * Broadcast event to rooms or all
     */
    rooms.forEach((room) => socket.to(room));
    socket.broadcast.emit(message.event, {
      data: message.data,
      params: message.params,
      type: message.type,
    });
    break;
  default:
    console.warn('Broadcast: message.type unknown');
  }
});

/* | -----------------------------------------------------------------------------------
 * | - Socket.io events -
 * | -----------------------------------------------------------------------------------
 */
io.on('connection', (socket) => {
  socket.on('leave', (rooms) => {
    if (Array.isArray(rooms)) {
      rooms.forEach((room) => socket.leave(room));
    } else {
      socket.leave(rooms);
    }
  });

  // Leave from all rooms
  socket.on('logout', () => {
    Object.keys(socket.rooms).forEach((room) => {
      if (socket.id !== room) {
        socket.leave(room);
      }
    });
  });
});

/* | -----------------------------------------------------------------------------------
 * | - Run the server -
 * | -----------------------------------------------------------------------------------
 */
server.listen(env.port, () => {
  console.log(`Listening on *:${env.port}`);
});
