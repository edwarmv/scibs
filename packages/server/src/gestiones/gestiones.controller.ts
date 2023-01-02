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
import { CreateGestionDto } from './dto/create-gestion.dto';
import { UpdateGestionDto } from './dto/update-gestion.dto';
import { Gestion } from './gestion.entity';
import { GestionesService } from './gestiones.service';

@UseGuards(JwtAuthGuard)
@Controller('gestiones')
export class GestionesController {
  constructor(private gestionesService: GestionesService) {}

  @Post()
  async create(@Body() createGestionDto: CreateGestionDto): Promise<Gestion> {
    return this.gestionesService.create(createGestionDto);
  }

  @Put(':idGestion')
  async update(
    @Param('idGestion', ParseIntPipe) idGestion: number,
    @Body() updateGestionDto: UpdateGestionDto
  ): Promise<Gestion> {
    return await this.gestionesService.update(idGestion, updateGestionDto);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      gestionesAperturadas: string;
    }
  ): Promise<{ values: Gestion[]; total: number }> {
    return await this.gestionesService.findAll(query);
  }

  @Get(':idGestion')
  async findOne(
    @Param('idGestion', ParseIntPipe) idGestion: number
  ): Promise<Gestion> {
    return this.gestionesService.findOne(idGestion);
  }

  @Delete(':idGestion')
  async remove(
    @Param('idGestion', ParseIntPipe) idGestion: number
  ): Promise<void> {
    await this.gestionesService.remove(idGestion);
  }
}
