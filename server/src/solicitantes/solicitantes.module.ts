import { Module } from '@nestjs/common';
import { SolicitantesService } from './solicitantes.service';
import { SolicitantesController } from './solicitantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitante } from './solicitante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitante])],
  providers: [SolicitantesService],
  controllers: [SolicitantesController],
})
export class SolicitantesModule {}
