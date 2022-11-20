import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { CreateUnidadManejoDto } from './dto/create-unidad-manejo.dto';
import { UpdateUnidadManejoDto } from './dto/update-unidad-manejo.dto';
import { UnidadManejo } from './unidad-manejo.entity';

@Injectable()
export class UnidadesManejoService {
  constructor(
    @InjectRepository(UnidadManejo)
    private unidadManejoRepository: Repository<UnidadManejo>
  ) {}

  async create({ nombre }: CreateUnidadManejoDto): Promise<UnidadManejo> {
    const unidadManejo = new UnidadManejo();
    unidadManejo.nombre = nombre.toLowerCase();

    try {
      return await this.unidadManejoRepository.save(unidadManejo);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async findAll({
    skip = 0,
    take = 5,
    term = '',
  }: {
    skip: number;
    take: number;
    term: string;
  }): Promise<{ values: UnidadManejo[]; total: number }> {
    const [values, total] = await this.unidadManejoRepository.findAndCount({
      skip,
      take,
      where: { nombre: Like(`%${term}%`) },
      order: { nombre: 'ASC' },
    });
    return { values, total };
  }

  findOne(id: number): Promise<UnidadManejo> {
    return this.unidadManejoRepository.findOneBy({ id });
  }

  async update(
    id: number,
    { nombre }: UpdateUnidadManejoDto
  ): Promise<UnidadManejo> {
    try {
      await this.unidadManejoRepository.update(id, {
        nombre: nombre.toLowerCase(),
      });
      return await this.unidadManejoRepository.findOneBy({ id });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.unidadManejoRepository.delete(id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          throw new ConflictException(
            'Unidad de manejo con materiales asociados'
          );
        }
      }
    }
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const fields = getDbErrorMsgFields(error.message, 'unidades_manejo');

    const nombreError = ['nombre'].every((value) => fields.includes(value));

    if (nombreError) {
      throw new DbConstraintError('Nombre duplicado');
    }
  }
}
