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
  ): Promise<Solicitante> {
    return await this.solicitantesService.update(
      idSolicitante,
      updateSolicitanteDto
    );
  }

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
    }
  ): Promise<{ values: Solicitante[]; total: number }> {
    return this.solicitantesService.findAll(query);
  }

  @Get(':idSolicitante')
  async findOne(
    @Param('idSolicitante', ParseIntPipe) idSolicitante: number
  ): Promise<Solicitante> {
    return this.solicitantesService.findOne(idSolicitante);
  }

  @Delete(':idSolicitante')
  async remove(
    @Param('idSolicitante', ParseIntPipe) idSolicitante: number
  ): Promise<void> {
    await this.solicitantesService.remove(idSolicitante);
  }
}
