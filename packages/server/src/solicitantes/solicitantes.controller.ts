import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { UpdateSolicitanteDto } from './dto/update-solicitante.dto';
import { Solicitante } from './solicitante.entity';
import { SolicitantesService } from './solicitantes.service';

@UseGuards(JwtAuthGuard)
@Controller('solicitantes')
export class SolicitantesController {
  constructor(private solicitantesService: SolicitantesService) {}

  @Post()
  async create(
    @Body() createSolicitanteDto: CreateSolicitanteDto
  ): Promise<Solicitante> {
    return this.solicitantesService.create(createSolicitanteDto);
  }

  @Put(':idSolicitante')
  async update(
    @Param('idSolicitante', ParseIntPipe) idSolicitante: number,
    @Body() updateSolicitanteDto: UpdateSolicitanteDto
  ): Promise<void> {
    await this.solicitantesService.update(idSolicitante, updateSolicitanteDto);
  }

  @Get()
  async findAll(): Promise<Solicitante[]> {
    return this.solicitantesService.findAll();
  }

  @Get(':idSolicitante')
  async findOne(
    @Param('idSolicitante', ParseIntPipe) idSolicitante: number
  ): Promise<Solicitante> {
    return this.solicitantesService.findOne(idSolicitante);
  }
}
