import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/auth/user.model';
import { Entrada } from 'src/entradas/entrada.entity';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Material } from 'src/materiales/material.entity';
import { OrdenOperacion } from 'src/orden-operaciones/orden-operacion.entity';
import { OrdenOperacionesService } from 'src/orden-operaciones/orden-operaciones.service';
import { Usuario } from 'src/usuarios/usuario.entity';
import { DataSource, Like, QueryFailedError, Repository } from 'typeorm';
import { ComprobanteEntradas } from './comprobante-entradas.entity';
import { CreateComprobanteEntradasDto } from './dto/create-comprobante-entradas.dto';
import { UpdateComprobanteEntradasDto } from './dto/update-comprobante-entradas.dto';

@Injectable()
export class ComprobantesEntradasService {
  constructor(
    @InjectRepository(ComprobanteEntradas)
    private comprobanteEntradasRepository: Repository<ComprobanteEntradas>,
    private ordenOperacionesService: OrdenOperacionesService,
    private dataSource: DataSource
  ) {}

  async create(
    user: UserModel,
    {
      documento,
      fechaEntrada,
      saldoInicial,
      proveedor,
      gestion,
      entradas,
    }: CreateComprobanteEntradasDto
  ): Promise<ComprobanteEntradas> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteEntradas = new ComprobanteEntradas();
      const usuario = new Usuario();
      usuario.id = user.sub;
      comprobanteEntradas.usuario = usuario;
      comprobanteEntradas.documento = documento;
      comprobanteEntradas.fechaEntrada = fechaEntrada;
      comprobanteEntradas.saldoInicial = saldoInicial;
      comprobanteEntradas.proveedor = proveedor;
      comprobanteEntradas.gestion = gestion;
      comprobanteEntradas.entradas = entradas;

      const orden = await this.ordenOperacionesService.getLastOrdenOperacion();
      const ordenOperacion = new OrdenOperacion();
      ordenOperacion.orden = orden + 1;
      comprobanteEntradas.ordenOperacion = ordenOperacion;

      const _comprobanteEntradas =
        await queryRunner.manager.save<ComprobanteEntradas>(
          comprobanteEntradas
        );
      await queryRunner.commitTransaction();

      return _comprobanteEntradas;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    idComprobanteEntradas: number,
    {
      documento,
      fechaEntrada,
      saldoInicial,
      proveedor,
      gestion,
      entradas,
    }: UpdateComprobanteEntradasDto
  ): Promise<ComprobanteEntradas> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteEntradas = new ComprobanteEntradas();

      comprobanteEntradas.id = idComprobanteEntradas;
      comprobanteEntradas.documento = documento;
      comprobanteEntradas.fechaEntrada = fechaEntrada;
      comprobanteEntradas.saldoInicial = saldoInicial;
      comprobanteEntradas.proveedor = proveedor;
      comprobanteEntradas.gestion = gestion;

      await queryRunner.manager.save<ComprobanteEntradas>(comprobanteEntradas);

      for (const entrada of entradas) {
        const _entrada = new Entrada();
        _entrada.comprobanteEntradas = comprobanteEntradas;
        _entrada.id = entrada.id;
        _entrada.cantidad = entrada.cantidad;
        _entrada.precioUnitario = entrada.precioUnitario;
        const material = new Material();
        material.id = entrada.material.id;
        _entrada.material = entrada.material;

        await queryRunner.manager.save<Entrada>(_entrada);
      }

      await queryRunner.commitTransaction();

      return await this.comprobanteEntradasRepository.findOneBy({
        id: idComprobanteEntradas,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof QueryFailedError) {
        if (error.driverError.errno === 19) {
          this.throwDbConstraintError(error);
        }
      }
    } finally {
      await queryRunner.release();
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
  }): Promise<{ values: ComprobanteEntradas[]; total: number }> {
    const [values, total] =
      await this.comprobanteEntradasRepository.findAndCount({
        skip,
        take,
        relations: {
          proveedor: true,
          gestion: true,
          entradas: { material: true },
        },
        where: [
          { documento: Like(`%${term}%`) },
          { proveedor: { nombre: Like(`%${term}%`) } },
        ],
        order: { fechaEntrada: 'DESC' },
      });
    return { values, total };
  }

  async findOne(idComprobanteEntradas: number): Promise<ComprobanteEntradas> {
    return this.comprobanteEntradasRepository.findOneBy({
      id: idComprobanteEntradas,
    });
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const entradasFields = getDbErrorMsgFields(error.message, 'entradas');
    const comprobanteEntradasFields = getDbErrorMsgFields(
      error.message,
      'comprobantes_entradas'
    );

    const materialError = ['comprobantes_entradas_id', 'materiales_id'].every(
      (value) => entradasFields.includes(value)
    );

    if (materialError) {
      throw new DbConstraintError('Material duplicado');
    }

    const documentoError = ['documento'].every((value) =>
      comprobanteEntradasFields.includes(value)
    );

    if (documentoError) {
      throw new DbConstraintError('Documento duplicado');
    }
  }
}
