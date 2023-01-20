import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserModel } from 'src/auth/user.model';
import { ComprobanteEntradas } from './comprobante-entradas.entity';
import { ComprobantesEntradasService } from './comprobantes-entradas.service';
import { CargarSaldosGestionAnteriorDto } from './dto/cargar-saldos-gestion-anterior.dto';
import { CreateComprobanteEntradasDto } from './dto/create-comprobante-entradas.dto';
import { UpdateComprobanteEntradasDto } from './dto/update-comprobante-entradas.dto';

@UseGuards(JwtAuthGuard)
@Controller('comprobantes-entradas')
export class ComprobantesEntradasController {
  constructor(
    private comprobantesEntradasService: ComprobantesEntradasService
  ) {}

  @Post()
  async create(
    @User() user: UserModel,
    @Body() createComprobanteEntradasDto: CreateComprobanteEntradasDto
  ): Promise<ComprobanteEntradas> {
    return this.comprobantesEntradasService.create(
      user,
      createComprobanteEntradasDto
    );
  }

  @Post('cargar-saldos-gestion-anterior')
  async cargarSaldosGestionAnterior(
    @User() user: UserModel,
    @Body() cargarSaldosGestionAnteriorDto: CargarSaldosGestionAnteriorDto
  ): Promise<void> {
    await this.comprobantesEntradasService.cargarSaldosGestionAnterior(
      user,
      cargarSaldosGestionAnteriorDto
    );
  }

  @Put(':idComprobanteEntradas')
  async update(
    @Param('idComprobanteEntradas', ParseIntPipe) idComprobanteEntradas: number,
    @Body() updateComprobanteEntradasDto: UpdateComprobanteEntradasDto
  ): Promise<ComprobanteEntradas> {
    return await this.comprobantesEntradasService.update(
      idComprobanteEntradas,
      updateComprobanteEntradasDto
    );
  }

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      saldoGestionAnterior: string;
      gestionId: string;
    }
  ): Promise<{ values: ComprobanteEntradas[]; total: number }> {
    return this.comprobantesEntradasService.findAll(query);
  }

  @Get(':idComprobanteEntradas')
  async findOne(
    @Param('idComprobanteEntradas', ParseIntPipe) idComprobanteEntradas: number
  ): Promise<ComprobanteEntradas> {
    return this.comprobantesEntradasService.findOne(idComprobanteEntradas);
  }

  @Delete(':idComprobanteEntradas')
  async remove(
    @Param('idComprobanteEntradas', ParseIntPipe) idComprobanteEntradas: number
  ) {
    return this.comprobantesEntradasService.remove(idComprobanteEntradas);
  }
}
