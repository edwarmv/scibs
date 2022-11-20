import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenOperacion } from './orden-operacion.entity';
import { OrdenOperacionesService } from './orden-operaciones.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenOperacion])],
  providers: [OrdenOperacionesService],
  exports: [OrdenOperacionesService],
})
export class OrdenOperacionesModule {}
