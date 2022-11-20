import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMaterial } from './stock-material.entity';
import { StockMaterialesService } from './stock-materiales.service';

@Module({
  imports: [TypeOrmModule.forFeature([StockMaterial])],
  providers: [StockMaterialesService],
  exports: [StockMaterialesService],
})
export class StockMaterialesModule {}
