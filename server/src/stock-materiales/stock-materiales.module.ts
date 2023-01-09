import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMaterial } from './stock-material.entity';
import { StockMaterialesService } from './stock-materiales.service';
import { StockMaterialesController } from './stock-materiales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockMaterial])],
  providers: [StockMaterialesService],
  exports: [StockMaterialesService],
  controllers: [StockMaterialesController],
})
export class StockMaterialesModule {}
