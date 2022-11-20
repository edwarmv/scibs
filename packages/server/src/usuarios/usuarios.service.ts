import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { QueryFailedError, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario();
    usuario.nombre = createUsuarioDto.nombre.toLowerCase();
    usuario.apellido = createUsuarioDto.apellido.toLowerCase();
    usuario.username = createUsuarioDto.username.toLowerCase();
    usuario.setPassword(createUsuarioDto.password);

    try {
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async update(
    idUsuario: number,
    { nombre, apellido, username }: UpdateUsuarioDto
  ): Promise<void> {
    try {
      await this.usuarioRepository.update(idUsuario, {
        nombre: nombre.toLowerCase(),
        apellido: apellido.toLowerCase(),
        username: username.toLowerCase(),
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async findOne(idUsuario: number): Promise<Usuario> {
    return this.usuarioRepository.findOneBy({ id: idUsuario });
  }

  findOneByUsername(username: string) {
    return this.usuarioRepository.findOne({
      where: { username },
      select: [
        'id',
        'nombre',
        'apellido',
        'username',
        'key',
        'salt',
        'passwordCambiado',
      ],
    });
  }

  async changePassword({
    username,
    password,
  }: ChangePasswordDto): Promise<void> {
    const usuario = await this.usuarioRepository.findOneBy({ username });
    if (!!!usuario) {
      throw new ConflictException('El usuario no existe');
    }
    usuario.setPassword(password);

    await this.usuarioRepository.update(
      { username },
      {
        key: usuario.key,
        salt: usuario.salt,
      }
    );
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const fields = getDbErrorMsgFields(error.message, 'usuarios');

    const usernameError = ['username'].every((value) => fields.includes(value));

    if (usernameError) {
      throw new DbConstraintError('Nombre de usuario duplicado');
    }
  }
}
