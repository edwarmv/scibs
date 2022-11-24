import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { CreateSolicitanteDto } from './dto/create-solicitante.dto';
import { UpdateSolicitanteDto } from './dto/update-solicitante.dto';
import { Solicitante } from './solicitante.entity';

@Injectable()
export class SolicitantesService {
  constructor(
    @InjectRepository(Solicitante)
    private solicitanteRepository: Repository<Solicitante>
  ) {}

  async create({
    nombre,
    apellido,
    ci,
  }: CreateSolicitanteDto): Promise<Solicitante> {
    const solicitante = new Solicitante();
    solicitante.nombre = nombre.toLowerCase();
    solicitante.apellido = apellido.toLowerCase();
    solicitante.ci = ci.toLowerCase();

    try {
      return await this.solicitanteRepository.save(solicitante);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async update(
    idSolicitante: number,
    { nombre, apellido, ci }: UpdateSolicitanteDto
  ): Promise<Solicitante> {
    try {
      await this.solicitanteRepository.update(idSolicitante, {
        nombre,
        apellido,
        ci,
      });

      return await this.solicitanteRepository.findOneBy({ id: idSolicitante });
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
  }): Promise<{ values: Solicitante[]; total: number }> {
    const [values, total] = await this.solicitanteRepository
      .createQueryBuilder('solicitante')
      .skip(skip)
      .take(take)
      .where("solicitante.apellido || ' ' || solicitante.nombre LIKE :term", {
        term: `%${term}%`,
      })
      .orderBy({
        'solicitante.apellido': 'DESC',
        'solicitante.nombre': 'DESC',
      })
      .getManyAndCount();
    return { values, total };
  }

  async findOne(idSolicitante: number): Promise<Solicitante> {
    return this.solicitanteRepository.findOneBy({ id: idSolicitante });
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const fields = getDbErrorMsgFields(error.message, 'solicitantes');

    const ciError = ['ci'].every((value) => fields.includes(value));

    if (ciError) {
      throw new DbConstraintError('CI duplicado');
    }
  }

  async remove(idSolicitante: number): Promise<void> {
    try {
      await this.solicitanteRepository.delete(idSolicitante);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          throw new ConflictException('Socitante con salidas asociadas');
        }
      }
    }
  }
}
