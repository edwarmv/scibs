import { Module } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './material.entity';
import { Partida } from 'src/partidas/partida.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material, Partida])],
  providers: [MaterialesService],
  controllers: [MaterialesController],
})
export class MaterialesModule {}
