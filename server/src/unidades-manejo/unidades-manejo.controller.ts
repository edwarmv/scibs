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
import { CreateUnidadManejoDto } from './dto/create-unidad-manejo.dto';
import { UpdateUnidadManejoDto } from './dto/update-unidad-manejo.dto';
import { UnidadManejo } from './unidad-manejo.entity';
import { UnidadesManejoService } from './unidades-manejo.service';

@UseGuards(JwtAuthGuard)
@Controller('unidades-manejo')
export class UnidadesManejoController {
  constructor(private unidadesManejoService: UnidadesManejoService) {}

  @Post()
  async create(
    @Body() createUnidadManejoDto: CreateUnidadManejoDto
  ): Promise<UnidadManejo> {
    return this.unidadesManejoService.create(createUnidadManejoDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUnidadManejoDto: UpdateUnidadManejoDto
  ): Promise<UnidadManejo> {
    return await this.unidadesManejoService.update(id, updateUnidadManejoDto);
  }

  @Get()
  findAll(
    @Query() query: { skip: number; take: number; term: string }
  ): Promise<{ values: UnidadManejo[]; total: number }> {
    return this.unidadesManejoService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UnidadManejo> {
    return this.unidadesManejoService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.unidadesManejoService.remove(id);
  }
}
