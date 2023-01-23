import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './material.entity';

@Injectable()
export class MaterialesService {
  constructor(
    @InjectRepository(Material) private materialRepository: Repository<Material>
  ) {}

  async create({
    codigoIndex,
    nombre,
    stockMinimo,
    caracteristicas,
    partida,
    unidadManejo,
  }: CreateMaterialDto): Promise<Material> {
    const material = new Material();
    material.codigoIndex = codigoIndex;
    material.nombre = nombre.toLowerCase();
    material.stockMinimo = stockMinimo;
    material.caracteristicas = caracteristicas
      ? caracteristicas.toLowerCase()
      : null;
    material.partida = partida;
    material.unidadManejo = unidadManejo;

    try {
      return await this.materialRepository.save(material);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async update(
    idMaterial: number,
    {
      codigoIndex,
      nombre,
      stockMinimo,
      caracteristicas,
      partida,
      unidadManejo,
    }: UpdateMaterialDto
  ): Promise<Material> {
    try {
      await this.materialRepository.update(idMaterial, {
        codigoIndex,
        nombre: nombre.toLowerCase(),
        stockMinimo,
        caracteristicas,
        partida,
        unidadManejo,
      });

      return await this.materialRepository.findOneBy({ id: idMaterial });
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
    partidaId,
  }: {
    skip: number;
    take: number;
    term: string;
    partidaId: number;
  }): Promise<{ values: Material[]; total: number }> {
    const [values, total] = await this.materialRepository.findAndCount({
      skip,
      take,
      where: {
        nombre: Like(`%${term}%`),
        partida: { id: Number(partidaId) ? Number(partidaId) : null },
      },
      order: { nombre: 'ASC' },
      relations: { unidadManejo: true, partida: true },
    });
    return { values, total };
  }

  async findOne(idMaterial: number): Promise<Material> {
    return this.materialRepository.findOneBy({ id: idMaterial });
  }

  async getLastMaterial(partidaId: number): Promise<{ codigoIndex: number }> {
    const [material] = await this.materialRepository.find({
      where: { partida: { id: partidaId } },
      order: { codigoIndex: 'DESC' },
      take: 1,
    });

    return {
      codigoIndex: material.codigoIndex,
    };
  }

  async remove(idMaterial: number): Promise<void> {
    try {
      await this.materialRepository.delete(idMaterial);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          throw new ConflictException(
            'Material con entradas o salidas asociados'
          );
        }
      }
    }
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const fields = getDbErrorMsgFields(error.message, 'materiales');
    const nombreError = ['nombre'].every((value) => fields.includes(value));
    if (nombreError) {
      throw new DbConstraintError('Nombre duplicado');
    }
    const codigoError = ['codigo_index', 'partidas_id'].every((value) =>
      fields.includes(value)
    );
    if (codigoError) {
      throw new DbConstraintError('Codigo de material duplicado');
    }
  }
}
