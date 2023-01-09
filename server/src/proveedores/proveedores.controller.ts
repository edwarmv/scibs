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
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './proveedor.entity';
import { ProveedoresService } from './proveedores.service';

@UseGuards(JwtAuthGuard)
@Controller('proveedores')
export class ProveedoresController {
  constructor(private proveedoresService: ProveedoresService) {}

  @Post()
  async create(
    @Body() createProveedorDto: CreateProveedorDto
  ): Promise<Proveedor> {
    return this.proveedoresService.create(createProveedorDto);
  }

  @Put(':idProveedor')
  async update(
    @Param('idProveedor', ParseIntPipe) idProveedor: number,
    @Body() updateProveedorDto: UpdateProveedorDto
  ): Promise<Proveedor> {
    return await this.proveedoresService.update(
      idProveedor,
      updateProveedorDto
    );
  }

  @Get()
  async findAll(
    @Query() query: { skip: number; take: number; term: string }
  ): Promise<{ values: Proveedor[]; total: number }> {
    return this.proveedoresService.findAll(query);
  }

  @Get(':idProveedor')
  async findOne(
    @Param('idProveedor', ParseIntPipe) idProveedor: number
  ): Promise<Proveedor> {
    return this.proveedoresService.findOne(idProveedor);
  }

  @Delete(':idProveedor')
  async remove(
    @Param('idProveedor', ParseIntPipe) idProveedor: number
  ): Promise<void> {
    await this.proveedoresService.remove(idProveedor);
  }
}
