import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { CreatePartidaDto } from './dto/create-partida.dto';
import { UpdatePartidaDto } from './dto/update-partida.dto';
import { Partida } from './partida.entity';

@Injectable()
export class PartidasService {
  constructor(
    @InjectRepository(Partida) private partidaRepository: Repository<Partida>
  ) {}

  async create({ numero, nombre }: CreatePartidaDto): Promise<Partida> {
    const partida = new Partida();
    partida.numero = numero;
    partida.nombre = nombre.toLowerCase();

    try {
      return await this.partidaRepository.save(partida);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.throwDbConstraintError(error);
      }
    }
  }

  async update(
    id: number,
    { numero, nombre }: UpdatePartidaDto
  ): Promise<Partida> {
    try {
      const partida = await this.partidaRepository.findOneBy({ id });
      if (!!!partida) {
        throw new ConflictException('Partida no existe');
      }
      return await this.partidaRepository.save({
        id,
        numero,
        nombre: nombre.toLowerCase(),
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        this.throwDbConstraintError(error);
      }
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.partidaRepository.delete(id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          throw new ConflictException(
            'Partida con materiales asociados'
          );
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
  }): Promise<{ values: Partida[]; total: number }> {
    const [values, total] = await this.partidaRepository
      .createQueryBuilder('partida')
      .skip(skip)
      .take(take)
      .where('partida.nombre LIKE :term', { term: `%${term}%` })
      .orWhere('partida.numero LIKE :term', { term: `%${term}%` })
      .orderBy('partida.nombre', 'ASC')
      .getManyAndCount();
    return { values, total };
  }

  async findOne(id: number): Promise<Partida> {
    return this.partidaRepository.findOneBy({ id });
  }

  private throwDbConstraintError(error: QueryFailedError) {
    if (error.driverError.errno === 19) {
      const fields = getDbErrorMsgFields(error.message, 'partidas');
      if (fields.includes('nombre')) {
        throw new DbConstraintError('Nombre duplicado');
      }
      if (fields.includes('numero')) {
        throw new DbConstraintError('Número duplicado');
      }
    }
  }
}
