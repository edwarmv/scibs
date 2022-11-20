import { Module } from '@nestjs/common';
import { UnidadesManejoService } from './unidades-manejo.service';
import { UnidadesManejoController } from './unidades-manejo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadManejo } from './unidad-manejo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadManejo])],
  providers: [UnidadesManejoService],
  controllers: [UnidadesManejoController],
})
export class UnidadesManejoModule {}
