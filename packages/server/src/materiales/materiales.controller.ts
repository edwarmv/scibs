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
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './material.entity';
import { MaterialesService } from './materiales.service';

@UseGuards(JwtAuthGuard)
@Controller('materiales')
export class MaterialesController {
  constructor(private materialesService: MaterialesService) {}

  @Post()
  async create(
    @Body() createMaterialDto: CreateMaterialDto
  ): Promise<Material> {
    return this.materialesService.create(createMaterialDto);
  }

  @Put(':idMaterial')
  async update(
    @Param('idMaterial', ParseIntPipe) idMaterial: number,
    @Body() updateMaterialDto: UpdateMaterialDto
  ): Promise<Material> {
    return await this.materialesService.update(idMaterial, updateMaterialDto);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      partidaId: number;
    }
  ): Promise<{ values: Material[]; total: number }> {
    return this.materialesService.findAll(query);
  }

  @Get(':idMaterial')
  async findOne(
    @Param('idMaterial', ParseIntPipe) idMaterial: number
  ): Promise<Material> {
    return this.materialesService.findOne(idMaterial);
  }

  @Get('get-last-codigo-material/:idPartida')
  async getLastCodigoIndex(
    @Param('idPartida', ParseIntPipe) partidaId: number
  ): Promise<{ codigoIndex: number }> {
    return await this.materialesService.getLastMaterial(partidaId);
  }

  @Delete(':idMaterial')
  async remove(
    @Param('idMaterial', ParseIntPipe) idmaterial: number
  ): Promise<void> {
    await this.materialesService.remove(idmaterial);
  }
}
