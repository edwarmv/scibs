import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './proveedor.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>
  ) {}

  async create({ nombre, nitCi }: CreateProveedorDto): Promise<Proveedor> {
    const proveedor = new Proveedor();
    proveedor.nombre = nombre.toLowerCase();
    proveedor.nitCi = nitCi;

    try {
      return await this.proveedorRepository.save(proveedor);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    }
  }

  async update(
    idProveedor: number,
    { nombre, nitCi }: UpdateProveedorDto
  ): Promise<Proveedor> {
    try {
      await this.proveedorRepository.update(idProveedor, { nombre, nitCi });

      return await this.proveedorRepository.findOneBy({ id: idProveedor });
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
  }): Promise<{ values: Proveedor[]; total: number }> {
    const [values, total] = await this.proveedorRepository.findAndCount({
      skip,
      take,
      where: { nombre: Like(`%${term}%`) },
    });
    return { values, total };
  }

  async findOne(idProveedor: number): Promise<Proveedor> {
    return this.proveedorRepository.findOneBy({ id: idProveedor });
  }

  async remove(idProveedor: number): Promise<void> {
    try {
      await this.proveedorRepository.delete(idProveedor);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          throw new ConflictException('Proveedor con entradas asociados');
        }
      }
    }
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const fields = getDbErrorMsgFields(error.message, 'proveedores');

    const nombreError = ['nombre'].every((value) => fields.includes(value));
    if (nombreError) {
      throw new DbConstraintError('Nombre duplicado');
    }

    const nitCiError = ['nit_ci'].every((value) => fields.includes(value));
    if (nitCiError) {
      throw new DbConstraintError('NIT/CI duplicado');
    }
  }
}
