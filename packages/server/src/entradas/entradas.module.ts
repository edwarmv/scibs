import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entrada } from './entrada.entity';
import { EntradasService } from './entradas.service';
import { EntradasController } from './entradas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Entrada])],
  providers: [EntradasService],
  exports: [EntradasService],
  controllers: [EntradasController],
})
export class EntradasModule {}
