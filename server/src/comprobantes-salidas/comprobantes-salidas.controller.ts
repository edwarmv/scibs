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
import { ComprobanteSalidas } from './comprobante-salidas.entity';
import { ComprobantesSalidasService } from './comprobantes-salidas.service';
import { CreateComprobanteSalidasDto } from './dto/create-comprobante-salidas.dto';
import { UpdateComprobanteSalidasDto } from './dto/update-comprobante-salidas.dto';

@UseGuards(JwtAuthGuard)
@Controller('comprobantes-salidas')
export class ComprobantesSalidasController {
  constructor(private comprobantesSalidasService: ComprobantesSalidasService) {}

  @Post()
  async create(
    @User() user: UserModel,
    @Body() createComprobanteSalidasDto: CreateComprobanteSalidasDto
  ) {
    return await this.comprobantesSalidasService.create(
      user,
      createComprobanteSalidasDto
    );
  }

  @Put(':idComprobanteSalidas')
  async update(
    @Param('idComprobanteSalidas', ParseIntPipe) idComprobanteSalidas: number,
    @Body() updateComprobanteSalidasDto: UpdateComprobanteSalidasDto
  ): Promise<ComprobanteSalidas> {
    return await this.comprobantesSalidasService.update(
      idComprobanteSalidas,
      updateComprobanteSalidasDto
    );
  }

  @Get()
  async findAll(
    @Query()
    query: {
      skip: number;
      take: number;
      term: string;
      gestionId: string;
    }
  ): Promise<{ values: ComprobanteSalidas[]; total: number }> {
    return this.comprobantesSalidasService.findAll(query);
  }

  @Get(':idComprobanteSalidas')
  async findOne(
    @Param('idComprobanteSalidas', ParseIntPipe) idComprobanteSalidas: number
  ): Promise<ComprobanteSalidas> {
    return this.comprobantesSalidasService.findOne(idComprobanteSalidas);
  }

  @Delete(':idComprobanteSalidas')
  async remove(
    @Param('idComprobanteSalidas', ParseIntPipe) idComprobanteSalidas: number
  ): Promise<void> {
    await this.comprobantesSalidasService.remove(idComprobanteSalidas);
  }
}
