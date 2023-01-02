import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isAfter } from 'date-fns';
import { UserModel } from 'src/auth/user.model';
import { Entrada } from 'src/entradas/entrada.entity';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { GestionesService } from 'src/gestiones/gestiones.service';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Material } from 'src/materiales/material.entity';
import { OrdenOperacion } from 'src/orden-operaciones/orden-operacion.entity';
import { OrdenOperacionesService } from 'src/orden-operaciones/orden-operaciones.service';
import { Proveedor } from 'src/proveedores/proveedor.entity';
import { StockMaterialesService } from 'src/stock-materiales/stock-materiales.service';
import { Usuario } from 'src/usuarios/usuario.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ComprobanteEntradas } from './comprobante-entradas.entity';
import { CargarSaldosGestionAnteriorDto } from './dto/cargar-saldos-gestion-anterior.dto';
import { CreateComprobanteEntradasDto } from './dto/create-comprobante-entradas.dto';
import { UpdateComprobanteEntradasDto } from './dto/update-comprobante-entradas.dto';

@Injectable()
export class ComprobantesEntradasService {
  constructor(
    @InjectRepository(ComprobanteEntradas)
    private comprobanteEntradasRepository: Repository<ComprobanteEntradas>,
    private ordenOperacionesService: OrdenOperacionesService,
    private gestionesService: GestionesService,
    private stockMaterialesService: StockMaterialesService,
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
    }: CreateComprobanteEntradasDto,
    idComprobanteSaldoGestionAnterior: number = null
  ): Promise<ComprobanteEntradas> {
    const saldoGestionAnterior = idComprobanteSaldoGestionAnterior
      ? true
      : false;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteEntradas = new ComprobanteEntradas();
      const usuario = new Usuario();
      usuario.id = user.sub;
      comprobanteEntradas.usuario = usuario;
      comprobanteEntradas.fechaEntrada = fechaEntrada;
      comprobanteEntradas.saldoInicial = saldoInicial;
      comprobanteEntradas.saldoGestionAnterior = saldoGestionAnterior;
      comprobanteEntradas.gestion = gestion;
      comprobanteEntradas.entradas = entradas.map((entrada) => {
        delete entrada.id;
        return entrada;
      });

      if (saldoGestionAnterior) {
        const comprobanteSaldoGestionAnterior = new ComprobanteEntradas();
        comprobanteSaldoGestionAnterior.id = idComprobanteSaldoGestionAnterior;
        comprobanteEntradas.comprobanteSaldoGestionAnterior =
          comprobanteSaldoGestionAnterior;
      }

      if (saldoInicial === false && saldoGestionAnterior === false) {
        comprobanteEntradas.documento = documento;
        comprobanteEntradas.proveedor = proveedor;
      }

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
      saldoGestionAnterior,
      proveedor,
      gestion,
      entradas,
    }: UpdateComprobanteEntradasDto
  ): Promise<ComprobanteEntradas> {
    await this.checkMovimientosComprobanteSalidas(idComprobanteEntradas);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteEntradas = new ComprobanteEntradas();

      comprobanteEntradas.id = idComprobanteEntradas;
      comprobanteEntradas.fechaEntrada = fechaEntrada;
      comprobanteEntradas.saldoInicial = saldoInicial;
      comprobanteEntradas.gestion = gestion;

      if (saldoGestionAnterior === false && saldoInicial === false) {
        comprobanteEntradas.documento = documento;
        comprobanteEntradas.proveedor = proveedor;
      }

      const savedComprobanteEntradas =
        await queryRunner.manager.save<ComprobanteEntradas>(
          comprobanteEntradas
        );

      const currentComprobanteEntradas =
        await this.comprobanteEntradasRepository.findOne({
          where: { id: idComprobanteEntradas },
          relations: { entradas: { material: true } },
        });
      const currentEntradas = currentComprobanteEntradas.entradas;

      const entradasId: number[] = entradas.map((entrada) => entrada.id);

      const removedEntradas = currentEntradas.filter(
        (x) => !entradasId.includes(x.id)
      );

      for (const removedEntrada of removedEntradas) {
        await queryRunner.manager.delete(Entrada, removedEntrada);
      }

      for (const entrada of entradas) {
        const _entrada = new Entrada();
        _entrada.comprobanteEntradas = comprobanteEntradas;
        if (entrada.id) {
          _entrada.id = entrada.id;
        }
        _entrada.cantidad = entrada.cantidad;
        _entrada.precioUnitario = entrada.precioUnitario;
        const material = new Material();
        material.id = entrada.material.id;
        _entrada.material = entrada.material;

        await queryRunner.manager.save<Entrada>(_entrada);
      }

      await queryRunner.commitTransaction();

      return savedComprobanteEntradas;
    } catch (error) {
      console.log(error);

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
    saldoInicial = '',
    saldoGestionAnterior = '',
    gestionId = '',
  }: {
    skip: number;
    take: number;
    term: string;
    saldoInicial: string;
    saldoGestionAnterior: string;
    gestionId: string;
  }): Promise<{ values: ComprobanteEntradas[]; total: number }> {
    saldoInicial = saldoInicial === 'true' ? '1' : '';
    const filters: string[] = [];
    if (saldoInicial) {
      filters.push('comprobanteEntradas.saldoInicial = 1');
    }
    if (saldoGestionAnterior === 'true') {
      filters.push('comprobanteEntradas.saldoGestionAnterior = 1');
    }
    if (gestionId) {
      filters.push('gestion.id = :gestionId');
    }
    const [values, total] = await this.comprobanteEntradasRepository
      .createQueryBuilder('comprobanteEntradas')
      .skip(skip)
      .take(take)
      .leftJoinAndSelect('comprobanteEntradas.proveedor', 'proveedor')
      .leftJoinAndSelect('comprobanteEntradas.gestion', 'gestion')
      .leftJoinAndSelect('comprobanteEntradas.entradas', 'entradas')
      .leftJoinAndSelect('comprobanteEntradas.ordenOperacion', 'ordenOperacion')
      .leftJoinAndSelect(
        'comprobanteEntradas.comprobanteSaldoGestionAnterior',
        'comprobanteSaldoGestionAnterior'
      )
      .leftJoinAndSelect('entradas.material', 'material')
      .where(
        `(COALESCE(comprobanteEntradas.documento, '000-' || comprobanteEntradas.id) LIKE :term
            OR
          proveedor.nombre LIKE :term)${
            filters.length ? ' AND ' + filters.join(' AND ') : ''
          }`,
        { term: `%${term}%`, gestionId }
      )
      .orderBy('comprobanteEntradas.fechaEntrada', 'DESC')
      .addOrderBy('ordenOperacion.orden', 'DESC')
      .getManyAndCount();
    return { values, total };
  }

  async findOne(idComprobanteEntradas: number): Promise<ComprobanteEntradas> {
    return this.comprobanteEntradasRepository.findOne({
      where: { id: idComprobanteEntradas },
      relations: {
        comprobanteSaldoGestionAnterior: true,
        proveedor: true,
        gestion: true,
        entradas: { material: true },
      },
    });
  }

  async remove(idComprobanteEntradas: number): Promise<void> {
    const comprobanteEntradas =
      await this.comprobanteEntradasRepository.findOne({
        where: { id: idComprobanteEntradas },
        relations: { entradas: true, ordenOperacion: true },
      });

    if (!comprobanteEntradas) {
      throw new ConflictException('Comprobante de entradas no encontrado');
    }

    const [lastComprobanteEntradas] =
      await this.comprobanteEntradasRepository.find({
        take: 1,
        relations: { ordenOperacion: true },
        order: { ordenOperacion: { orden: 'DESC' } },
      });

    if (
      lastComprobanteEntradas &&
      idComprobanteEntradas !== lastComprobanteEntradas.id
    ) {
      throw new ConflictException(
        `Solo puede eliminar el último comprobante registrado. Documento: ${
          lastComprobanteEntradas.documento
            ? lastComprobanteEntradas.documento
            : '000-' + lastComprobanteEntradas.id
        }`
      );
    }

    await this.checkMovimientosComprobanteSalidas(idComprobanteEntradas);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const entrada of comprobanteEntradas.entradas) {
        await queryRunner.manager.delete(Entrada, entrada.id);
      }
      await queryRunner.manager.delete(
        ComprobanteEntradas,
        idComprobanteEntradas
      );
      await queryRunner.manager.delete(
        OrdenOperacion,
        comprobanteEntradas.ordenOperacion.id
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async cargarSaldosGestionAnterior(
    user: UserModel,
    { from, to, fechaEntrada }: CargarSaldosGestionAnteriorDto
  ): Promise<void> {
    from = await this.gestionesService.findOne(from.id);
    to = await this.gestionesService.findOne(to.id);

    if (from.id === to.id) {
      throw new ConflictException('Las gestiones deben ser diferentes');
    }

    if (from.fechaCierre === null) {
      throw new ConflictException(
        'La gestión de la que desea cargar los saldos debe de ser una gestion con fecha de cierre'
      );
    }

    if (isAfter(new Date(from.fechaCierre), new Date(to.fechaApertura))) {
      throw new ConflictException(
        'La gestión de la que desea cargar los saldos debe ser anterior'
      );
    }

    const { total } = await this.stockMaterialesService.findAll({
      idGestion: from.id.toString(),
      conSaldo: 'true',
    });
    const { values } = await this.stockMaterialesService.findAll({
      take: total,
    });

    type comprobantesMap = {
      idComprobanteEntradas: number;
      idProveedor: number;
      saldoInicial: boolean;
      entradas: {
        idMaterial: number;
        cantidad: number;
        precioUnitario: number;
      }[];
    };

    const comprobantes = new Map<number, comprobantesMap>();

    for (const value of values) {
      const entrada = {
        idMaterial: value.idMaterial,
        cantidad: value.stock,
        precioUnitario: value.precioUnitarioEntrada,
      };
      if (comprobantes.has(value.idComprobanteEntradas)) {
        const comprobante = comprobantes.get(value.idComprobanteEntradas);
        comprobante.entradas.push(entrada);
        comprobantes.set(value.idComprobanteEntradas, comprobante);
      } else {
        const comprobante: comprobantesMap = {
          idComprobanteEntradas: value.idComprobanteEntradas,
          idProveedor: value.idProveedor,
          saldoInicial: value.saldoInicial,
          entradas: [entrada],
        };
        comprobantes.set(value.idComprobanteEntradas, comprobante);
      }
    }

    for (const [, comprobante] of comprobantes) {
      const proveedor = new Proveedor();
      await this.create(
        user,
        {
          fechaEntrada,
          proveedor,
          saldoInicial: comprobante.saldoInicial,
          entradas: comprobante.entradas.map((value): Entrada => {
            const entrada = new Entrada();
            const material = new Material();
            material.id = value.idMaterial;
            entrada.material = material;
            entrada.cantidad = value.cantidad;
            entrada.precioUnitario = value.precioUnitario;
            return entrada;
          }),
          gestion: to,
          documento: null,
        },
        comprobante.idComprobanteEntradas
      );
    }
  }

  async checkMovimientosComprobanteSalidas(
    idComprobanteEntradas: number
  ): Promise<void> {
    const comprobanteEntradas =
      await this.comprobanteEntradasRepository.findOne({
        where: { id: idComprobanteEntradas },
        relations: {
          entradas: { movimientos: { salida: { comprobanteSalidas: true } } },
        },
      });
    const documentosComprobantesSalidas = new Set<string>();
    for (const entrada of comprobanteEntradas.entradas) {
      for (const movimiento of entrada.movimientos) {
        const documento = movimiento.salida.comprobanteSalidas.documento;
        const id = movimiento.salida.comprobanteSalidas.id;
        documentosComprobantesSalidas.add(documento ? documento : `000-${id}`);
      }
    }
    if (documentosComprobantesSalidas.size) {
      throw new ConflictException(
        `Comprobante con salidas asociadas. Documentos de comprobantes de salidas: ${[
          ...documentosComprobantesSalidas,
        ].join(' ,')}`
      );
    }
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
