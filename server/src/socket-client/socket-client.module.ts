import { Module } from '@nestjs/common';
import { SocketClientProvider } from './socket-client.provider';
import { SocketClientProxyService } from './socket-client-proxy.service';

@Module({
  providers: [SocketClientProvider, SocketClientProxyService],
  exports: [SocketClientProxyService],
})
export class SocketClientModule {}
