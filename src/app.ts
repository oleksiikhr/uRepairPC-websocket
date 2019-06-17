/* | -----------------------------------------------------------------------------------
 * | - import -
 * | -----------------------------------------------------------------------------------
 */
import http from 'http';
import Redis from 'ioredis';
import socketIO from 'socket.io';
import * as env from './env';
import autodeploySubscribeHandler from './psubscribe/autodeploy';
import serverSubscribeHandler from './psubscribe/server';

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
redis.psubscribe('autodeploy.*');
redis.on('pmessage', (channel, pattern, message) => {
  switch (channel) {
    case 'server.*':
      serverSubscribeHandler(message, io.sockets);
      break;
    case 'autodeploy.*':
      autodeploySubscribeHandler(message, io);
      break;
    default:
      console.warn('[PMessage] ->', channel);
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
server.listen(env.port, env.hostName, () => {
  console.log(`Listening on ${env.hostName || '*'}:${env.port}`);
});
