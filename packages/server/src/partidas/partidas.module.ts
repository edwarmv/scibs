import { Module } from '@nestjs/common';
import { PartidasService } from './partidas.service';
import { PartidasController } from './partidas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partida } from './partida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partida])],
  providers: [PartidasService],
  controllers: [PartidasController],
})
export class PartidasModule {}
