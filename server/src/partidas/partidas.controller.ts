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
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { Partida } from './partida.entity';
import { PartidasService } from './partidas.service';

@UseGuards(JwtAuthGuard)
@Controller('partidas')
export class PartidasController {
  constructor(private partidasService: PartidasService) {}

  @Post()
  async create(@Body() createPartidaDto: CreatePartidaDto): Promise<Partida> {
    return this.partidasService.create(createPartidaDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePartidaDto: UpdatePartidaDto
  ): Promise<Partida> {
    return this.partidasService.update(id, updatePartidaDto);
  }

  @Get()
  async findAll(
    @Query() query: { skip: number; take: number; term: string }
  ): Promise<{ values: Partida[]; total: number }> {
    return this.partidasService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Partida> {
    return this.partidasService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.partidasService.remove(id);
  }
}
