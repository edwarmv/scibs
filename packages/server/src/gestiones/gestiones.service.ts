import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isAfter } from 'date-fns';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateGestionDto } from './dto/create-gestion.dto';
import { UpdateGestionDto } from './dto/update-gestion.dto';
import { Gestion } from './gestion.entity';

@Injectable()
export class GestionesService {
  constructor(
    @InjectRepository(Gestion) private gestionRepository: Repository<Gestion>
  ) {}

  async create({ fechaApertura }: CreateGestionDto): Promise<Gestion> {
    const gestion = new Gestion();

    gestion.fechaApertura = fechaApertura;

    try {
      return await this.gestionRepository.save(gestion);
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    idGestion: number,
    { fechaApertura, fechaCierre }: UpdateGestionDto
  ): Promise<Gestion> {
    try {
      if (fechaCierre) {
        if (!isAfter(new Date(fechaCierre), new Date(fechaApertura))) {
          throw new ConflictException(
            'La fecha de cierre debe ser posterior a la fecha de apertura'
          );
        }
        await this.gestionRepository.update(idGestion, {
          fechaApertura,
          fechaCierre,
        });
      }

      return await this.gestionRepository.findOneBy({ id: idGestion });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
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
  }): Promise<{ values: Gestion[]; total: number }> {
    const [values, total] = await this.gestionRepository
      .createQueryBuilder('gestiones')
      .skip(skip)
      .take(take)
      .where("STRFTIME('%d/%m/%Y', gestiones.fechaApertura) LIKE :term", {
        term: `%${term}%`,
      })
      .orWhere("STRFTIME('%d/%m/%Y', gestiones.fechaCierre) LIKE :term", {
        term: `%${term}%`,
      })
      .orderBy('gestiones.fechaApertura', 'DESC')
      .getManyAndCount();
    return { values, total };
  }

  async findOne(idGestion: number): Promise<Gestion> {
    return this.gestionRepository.findOneBy({ id: idGestion });
  }

  async remove(idGestion: number): Promise<void> {
    try {
      await this.gestionRepository.delete(idGestion);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          throw new ConflictException(
            'Gestión con entradas o salidas asociados'
          );
        }
      }
    }
  }
}
