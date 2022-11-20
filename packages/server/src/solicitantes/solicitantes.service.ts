import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { QueryFailedError, Repository } from 'typeorm';
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
    solicitante.nombre = nombre;
    solicitante.apellido = apellido;
    solicitante.ci = ci;

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
  ): Promise<void> {
    try {
      await this.solicitanteRepository.update(idSolicitante, {
        nombre,
        apellido,
        ci,
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async findAll(): Promise<Solicitante[]> {
    return this.solicitanteRepository.find();
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
}
