import io from 'socket.io-client';
import Redis from 'ioredis';
import * as types from '../src/enum/types';
import { port } from '../src/env';

describe('Check connections and events', () => {
  let socket1: SocketIOClient.Socket;
  let socket2: SocketIOClient.Socket;
  const redis = new Redis();

  /*
   * Server (laravel broadcast event to the socket server
   */
  const redisEvent = (event: string, type: string, socketId: string, data?: any, rooms?: Array<string> | string) => {
    return redis.publish('server.test', JSON.stringify({
      data: {
        event, data, rooms, type, socketId
      }
    }));
  };

  /*
   * Make 2 connections to the socket
   */
  beforeEach((done) => {
    socket1 = io.connect('http://localhost:' + port);
    socket2 = io.connect('http://localhost:' + port);

    socket1.on('connect', () => {
      if (socket1.connected && socket2.connected) {
        done();
      }
    });
    socket2.on('connect', () => {
      if (socket1.connected && socket2.connected) {
        done();
      }
    });
  });

  afterEach((done) => {
    if (socket1.connected) {
      socket1.disconnect();
    }
    if (socket2.connected) {
      socket2.disconnect();
    }
    done();
  });

  afterAll(async (done) => {
    await redis.quit();
    done();
  });

  describe('Listener events from the Server', () => {
    test('Socket1 joins the room, and Socket2 makes an event', (done) => {
      socket1.once('test', (data: any) => {
        expect({data: {name: 'Test'}, type: types.CREATE}).toStrictEqual(data);
        done();
      });

      // Socket1 join to room: test-1
      redisEvent('test', types.JOIN, socket1.id, null, ['test-1']);

      // Socket2 create something
      redisEvent('test', types.CREATE, socket2.id, {name: 'Test'}, ['test-1', 'test-2']);
    });
  });
});
