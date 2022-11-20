import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserModel } from 'src/auth/user.model';
import { ComprobanteEntradas } from './comprobante-entradas.entity';
import { ComprobantesEntradasService } from './comprobantes-entradas.service';
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
    @Query() query: { skip: number; take: number; term: string }
  ): Promise<{ values: ComprobanteEntradas[]; total: number }> {
    return this.comprobantesEntradasService.findAll(query);
  }

  @Get(':idComprobanteEntradas')
  async findOne(
    @Param('idComprobanteEntradas', ParseIntPipe) idComprobanteEntradas: number
  ): Promise<ComprobanteEntradas> {
    return this.comprobantesEntradasService.findOne(idComprobanteEntradas);
  }
}
