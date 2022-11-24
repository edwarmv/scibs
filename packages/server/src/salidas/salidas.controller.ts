import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Salida } from './salida.entity';
import { SalidasService } from './salidas.service';

@UseGuards(JwtAuthGuard)
@Controller('salidas')
export class SalidasController {
  constructor(private salidasService: SalidasService) {}

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      solicitanteId: string;
      gestionId: string;
      materialId: string;
      vencido: string;
    }
  ): Promise<{ values: Salida[]; total: number }> {
    return this.salidasService.findAll(query);
  }
}
