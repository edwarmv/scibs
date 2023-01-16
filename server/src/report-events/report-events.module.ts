import { Module } from '@nestjs/common';
import { SocketClientModule } from 'src/socket-client/socket-client.module';
import { ReportEventsController } from './report-events.controller';

@Module({
  imports: [SocketClientModule],
  providers: [],
  controllers: [ReportEventsController],
})
export class ReportEventsModule {}
