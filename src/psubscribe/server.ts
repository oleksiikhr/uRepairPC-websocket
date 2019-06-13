import socketIO from 'socket.io';
import allTypes, * as type from '../enum/types';

export default (message: any, sockets: socketIO.Namespace) => {

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

  const socket = sockets.connected[message.socketId];
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
        app: 'server',
        data: message.data,
        params: message.params,
        type: message.type,
      });
      break;
    default:
      console.warn('Broadcast: message.type unknown');
  }
};
