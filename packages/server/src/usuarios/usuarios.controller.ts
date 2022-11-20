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
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    await this.usuariosService.changePassword(changePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':idUsuario')
  async update(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto
  ) {
    await this.usuariosService.update(idUsuario, updateUsuarioDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':idUsuario')
  async findOne(
    @Param('idUsuario', ParseIntPipe) idUsuario: number
  ): Promise<Usuario> {
    return this.usuariosService.findOne(idUsuario);
  }
}
