/* | -----------------------------------------------------------------------------------
 * | - import -
 * | -----------------------------------------------------------------------------------
 */
import http from 'http';
import Redis from 'ioredis';
import request from 'request-promise-native';
import socketIO from 'socket.io';
import * as env from './env';

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

  // Get data from laravel and validate
  try {
    message = JSON.parse(message).data;

    if (!message.emit || !message.permissions || !message.data) {
      throw new Error('Structure invalidated');
    }
  } catch (e) {
    console.warn(e);
    return;
  }

  // Prepare for output data
  const sendData = io;

  if (Array.isArray(message.permissions)) {
    message.permissions.forEach((permission: string) => {
      sendData.in(permission);
    });
  } else {
    sendData.in(message.permissions);
  }

  sendData.emit(message.emit, message.data);
});

/* | -----------------------------------------------------------------------------------
 * | - Socket.io events -
 * | -----------------------------------------------------------------------------------
 */
io.on('connection', (socket) => {

  const leaveFromAllRooms = () => {
    Object.keys(socket.rooms).forEach((room) => {
      if (socket.id !== room) {
        socket.leave(room);
      }
    });
  };

  // Get token and validate on the server (make request)
  socket.on('auth', async (token) => {
    leaveFromAllRooms();

    try {
      const res = await request(env.laravelServer + '/api/auth/profile?token=' + token, {
        resolveWithFullResponse: true,
      });

      // Join to rooms by user permissions
      const body = JSON.parse(res.body);
      socket.join(body.permissions);

    } catch (e) {
      //
    }
  });

  // Exit from all rooms
  socket.on('logout', () => {
    leaveFromAllRooms();
  });
});

/* | -----------------------------------------------------------------------------------
 * | - Run the server -
 * | -----------------------------------------------------------------------------------
 */
server.listen(env.port, () => {
  console.log(`Listening on *:${env.port}`);
});
