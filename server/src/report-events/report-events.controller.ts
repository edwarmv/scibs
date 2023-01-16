import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, Payload } from '@nestjs/microservices';
import { Socket } from 'socket.io-client';
import { SocketClientProxyService } from 'src/socket-client/socket-client-proxy.service';

@Controller('report-events')
export class ReportEventsController {
  constructor(
    private readonly socketClientProxyService: SocketClientProxyService
  ) {}

  @Get()
  test() {
    this.socketClientProxyService
      .emit('message', 'from nestjs')
      .subscribe((messsage) => {
        console.log('edwar', messsage)
      });
    return 'ok';
  }

  @MessagePattern('my response')
  handleSendHello(@Payload() data: string, @Ctx() client: Socket) {
    console.log('got welcome from server', data);
    const responseMessage = 'Ohayo';
    client.emit('my event', responseMessage);
  }
}
