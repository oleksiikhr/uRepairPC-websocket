import socketIO from 'socket.io';

export default (message: any, io: socketIO.Server) => {

  /*
   * Validate structure
   */
  try {
    message = JSON.parse(message);

    if (!message.event) {
      throw new Error('Event is empty');
    }

    if (typeof message.data === 'undefined') {
      throw new Error('Data is undefined');
    }
  } catch (e) {
    console.warn(e);
    return;
  }

  // Send event
  io.emit(message.event, {
    app: 'autodeploy',
    data: message.data
  })
}
