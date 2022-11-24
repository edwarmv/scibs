import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StockMaterialesService } from './stock-materiales.service';

@UseGuards(JwtAuthGuard)
@Controller('stock-materiales')
export class StockMaterialesController {
  constructor(private stockMaterialesService: StockMaterialesService) {}

  @Get(':idMaterial')
  async getStockMaterial(
    @Param('idMaterial', ParseIntPipe) idMaterial: number
  ): Promise<{ stock: number }> {
    const stock = await this.stockMaterialesService.getStockMaterial(
      idMaterial
    );
    return { stock };
  }
}
