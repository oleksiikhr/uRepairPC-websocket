import IoRedis from 'ioredis';
import {
  AUTODEPLOY as APP_AUTODEPLOY,
  SERVER as APP_SERVER,
} from '../enum/apps';
import Socket from '../socket';
import AutodeployHandler from '../socket/handlers/AutodeployHandler';
import ServerHandler from '../socket/handlers/ServerHandler';

export default class Redis {
  public redis: IoRedis.Redis;
  public socket: Socket;

  constructor (socket: Socket) {
    this.redis = new IoRedis();
    this.socket = socket;
  }

  public init (): void {
    this.psubscribe();
    this.pmessage();
  }

  private psubscribe (): void {
    Object.keys(Redis.handlers).forEach((subscribeName) => {
      this.redis.psubscribe(subscribeName);
    });
  }

  private pmessage (): void {
    this.redis.on('pmessage', (channel, pattern, message) => {
      const handler = Redis.handlers[channel];

      if (handler) {
        try {
          new handler(this.socket, message).execute();
        } catch (e) {
          console.warn(e);
        }
      } else {
        console.warn('[Redis.pmessage] channel is unknown:', channel);
      }
    });
  }

  // FIXME { [x: string]: IHandler } ?
  static get handlers () {
    return {
      [`${APP_SERVER}.*`]: ServerHandler,
      [`${APP_AUTODEPLOY}.*`]: AutodeployHandler,
    };
  }
}
