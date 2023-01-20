import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Entrada } from './entrada.entity';
import { EntradasService } from './entradas.service';

@UseGuards(JwtAuthGuard)
@Controller('entradas')
export class EntradasController {
  constructor(private entradasService: EntradasService) {}

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      proveedorId: string;
      gestionId: string;
      materialId: string;
      saldoGestionAnterior: string;
    }
  ): Promise<{ values: Entrada[]; total: number }> {
    return this.entradasService.findAll(query);
  }
}
