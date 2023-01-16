import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { SocketClientProvider } from './socket-client.provider';

@Injectable()
export class SocketClientProxyService extends ClientProxy {
  @Inject(SocketClientProvider)
  private client: SocketClientProvider;

  async connect(): Promise<any> {
    this.client.getSocket();
    console.log('connect client proxy');
  }

  async close() {
    this.client.getSocket().disconnect();
    console.log('disconnect client proxy');
  }

  /**
   * this method use when you use SocketClientProxyService.emit
   */
  async dispatchEvent(packet: ReadPacket<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(packet)
      this.client.getSocket().emit(packet.pattern, packet.data, (data) => {
        resolve(data)
      });
    });
  }

  /**
   * this method will be call when use SocketClientProxyService.send
   * can be use to implement request-response
   */
  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void
  ): () => void {
    console.log('message:', packet);

    // In a real-world application, the "callback" function should be executed
    // with payload sent back from the responder. Here, we'll simply simulate (5 seconds delay)
    // that response came through by passing the same "data" as we've originally passed in.
    setTimeout(() => callback({ response: packet.data }), 5000);

    return () => console.log('teardown');
  }
}
