import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserModel } from 'src/auth/user.model';
import { ComprobanteSalidas } from './comprobante-salidas.entity';
import { ComprobantesSalidasService } from './comprobantes-salidas.service';
import { CreateComprobanteSalidasDto } from './dto/create-comprobante-salidas.dto';

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

  @Get()
  async findAll(
    @Query() query: { skip: number; take: number; term: string }
  ): Promise<{ values: ComprobanteSalidas[]; total: number }> {
    return this.comprobantesSalidasService.findAll(query);
  }
}
