import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { StockMaterial } from './stock-material.entity';
import { StockMaterialesService } from './stock-materiales.service';

@UseGuards(JwtAuthGuard)
@Controller('stock-materiales')
export class StockMaterialesController {
  constructor(private stockMaterialesService: StockMaterialesService) {}

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      idGestion: string;
      idMaterial: string;
      saldosNulos: string;
      conSaldo: string;
      saldosIniciales: string;
      saldosGestionAnterior: string;
    }
  ): Promise<{ values: StockMaterial[]; total: number }> {
    return await this.stockMaterialesService.findAll(query);
  }

  @Get(':idMaterial')
  async getStockMaterial(
    @Param('idMaterial', ParseIntPipe) idMaterial: number,
    @Query()
    query: {
      idGestion: string;
    }
  ): Promise<{ stock: number }> {
    const stock = await this.stockMaterialesService.getStockMaterial(
      idMaterial,
      query
    );
    return { stock };
  }
}
