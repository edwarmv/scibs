import { Module } from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import { GestionesController } from './gestiones.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestion } from './gestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gestion])],
  providers: [GestionesService],
  controllers: [GestionesController],
  exports: [GestionesService],
})
export class GestionesModule {}
