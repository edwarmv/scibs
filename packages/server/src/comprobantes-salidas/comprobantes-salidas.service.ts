import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/auth/user.model';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { Movimiento } from 'src/movimientos/movimiento.entity';
import { OrdenOperacion } from 'src/orden-operaciones/orden-operacion.entity';
import { OrdenOperacionesService } from 'src/orden-operaciones/orden-operaciones.service';
import { CreateSalidaDto } from 'src/salidas/dto/create-salida.dto';
import { Salida } from 'src/salidas/salida.entity';
import { SalidasService } from 'src/salidas/salidas.service';
import { Usuario } from 'src/usuarios/usuario.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ComprobanteSalidas } from './comprobante-salidas.entity';
import { CreateComprobanteSalidasDto } from './dto/create-comprobante-salidas.dto';
import { UpdateComprobanteSalidasDto } from './dto/update-comprobante-salidas.dto';

@Injectable()
export class ComprobantesSalidasService {
  constructor(
    @InjectRepository(ComprobanteSalidas)
    private comprobanteSalidasRepository: Repository<ComprobanteSalidas>,
    private ordenOperacionesService: OrdenOperacionesService,
    private salidasService: SalidasService,
    private dataSource: DataSource
  ) {}

  async create(
    user: UserModel,
    {
      documento,
      fechaSalida,
      vencido,
      solicitante,
      gestion,
      salidas,
    }: CreateComprobanteSalidasDto
  ): Promise<ComprobanteSalidas> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteSalidas = new ComprobanteSalidas();
      const usuario = new Usuario();
      usuario.id = user.sub;
      comprobanteSalidas.usuario = usuario;
      comprobanteSalidas.fechaSalida = fechaSalida;
      comprobanteSalidas.vencido = vencido;
      if (!vencido) {
        comprobanteSalidas.documento = documento;
        comprobanteSalidas.solicitante = solicitante;
      }
      comprobanteSalidas.gestion = gestion;

      const orden = await this.ordenOperacionesService.getLastOrdenOperacion();
      const ordenOperacion = new OrdenOperacion();
      ordenOperacion.orden = orden + 1;
      comprobanteSalidas.ordenOperacion = ordenOperacion;

      const _comprobanteSalidas = await queryRunner.manager.save(
        comprobanteSalidas
      );

      for (const salida of salidas) {
        const createSalidaDto = new CreateSalidaDto();
        createSalidaDto.cantidad = salida.cantidad;
        createSalidaDto.material = salida.material;
        createSalidaDto.comprobanteSalidas = _comprobanteSalidas;
        await this.salidasService.create(createSalidaDto, gestion.id);
      }
      await queryRunner.commitTransaction();

      return _comprobanteSalidas;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }

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
    idComprobanteSalidas: number,
    {
      documento,
      fechaSalida,
      vencido,
      solicitante,
      gestion,
      salidas,
    }: UpdateComprobanteSalidasDto
  ): Promise<ComprobanteSalidas> {
    const currentComprobanteSalidas =
      await this.comprobanteSalidasRepository.findOne({
        where: { id: idComprobanteSalidas },
        relations: { salidas: { material: true } },
      });
    if (!currentComprobanteSalidas) {
      throw new ConflictException('Comprobante de salidas no encontrado');
    }

    const [lastComprobanteSalidas] =
      await this.comprobanteSalidasRepository.find({
        take: 1,
        relations: { ordenOperacion: true },
        order: { ordenOperacion: { orden: 'DESC' } },
      });

    if (idComprobanteSalidas !== lastComprobanteSalidas.id) {
      throw new ConflictException(
        `Solo puede actualizar el último comprobante registrado. Documento: ${
          lastComprobanteSalidas.vencido
            ? '000-' + lastComprobanteSalidas.id
            : lastComprobanteSalidas.documento
        }`
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteSalidas = new ComprobanteSalidas();
      comprobanteSalidas.id = idComprobanteSalidas;
      comprobanteSalidas.documento = documento;
      comprobanteSalidas.fechaSalida = fechaSalida;
      comprobanteSalidas.vencido = vencido;
      comprobanteSalidas.solicitante = solicitante;
      comprobanteSalidas.gestion = gestion;

      const savedComprobanteSalidas = await queryRunner.manager.save(
        ComprobanteSalidas,
        comprobanteSalidas
      );

      const currentSalidas = currentComprobanteSalidas.salidas;

      for (const currentSalida of currentSalidas) {
        await this.salidasService.remove(currentSalida.id);
      }

      for (const salida of salidas) {
        const createSalidaDto = new CreateSalidaDto();
        createSalidaDto.cantidad = salida.cantidad;
        createSalidaDto.material = salida.material;
        createSalidaDto.comprobanteSalidas = savedComprobanteSalidas;
        await this.salidasService.create(createSalidaDto, gestion.id);
      }
      await queryRunner.commitTransaction();

      return savedComprobanteSalidas;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async findAll({
    skip = 0,
    take = 5,
    term = '',
    vencido = '',
    gestionId = '',
  }: {
    skip: number;
    take: number;
    term: string;
    vencido: string;
    gestionId: string;
  }): Promise<{ values: ComprobanteSalidas[]; total: number }> {
    vencido = vencido === 'true' ? '1' : '';
    const filters: string[] = [];
    if (vencido) {
      filters.push('comprobanteSalidas.vencido = 1');
    }
    if (gestionId) {
      filters.push('gestion.id = :gestionId');
    }
    const [values, total] = await this.comprobanteSalidasRepository
      .createQueryBuilder('comprobanteSalidas')
      .skip(skip)
      .take(take)
      .leftJoinAndSelect('comprobanteSalidas.solicitante', 'solicitante')
      .leftJoinAndSelect('comprobanteSalidas.gestion', 'gestion')
      .leftJoinAndSelect('comprobanteSalidas.ordenOperacion', 'ordenOperacion')
      .leftJoinAndSelect('comprobanteSalidas.salidas', 'salidas')
      .leftJoinAndSelect('salidas.material', 'material')
      .where(
        `
        (COALESCE(comprobanteSalidas.documento, '000-' || comprobanteSalidas.id) LIKE :term
          OR
        solicitante.apellido || ' ' || solicitante.nombre LIKE :term)${
          filters.length ? ' AND ' + filters.join(' AND ') : ''
        }`,
        { term: `%${term}%`, gestionId }
      )
      .orderBy('comprobanteSalidas.fechaSalida', 'DESC')
      .addOrderBy('ordenOperacion.orden', 'DESC')
      .getManyAndCount();
    return { values, total };
  }

  async findOne(idComprobanteSalidas: number): Promise<ComprobanteSalidas> {
    return await this.comprobanteSalidasRepository.findOne({
      where: { id: idComprobanteSalidas },
      relations: {
        solicitante: true,
        gestion: true,
        salidas: { material: true },
      },
    });
  }

  async remove(idComprobanteSalidas: number): Promise<void> {
    const comprobanteSalidas = await this.comprobanteSalidasRepository.findOne({
      where: { id: idComprobanteSalidas },
      relations: { salidas: { movimientos: true }, ordenOperacion: true },
    });

    if (!comprobanteSalidas) {
      throw new ConflictException('Comprobante de salidas no encontrado');
    }

    const [lastComprobanteSalidas] =
      await this.comprobanteSalidasRepository.find({
        take: 1,
        relations: { ordenOperacion: true },
        order: { ordenOperacion: { orden: 'DESC' } },
      });

    if (idComprobanteSalidas !== lastComprobanteSalidas.id) {
      throw new ConflictException(
        `Solo puede eliminar el último comprobante registrado. Documento: ${
          lastComprobanteSalidas.vencido
            ? '000-' + lastComprobanteSalidas.id
            : lastComprobanteSalidas.documento
        }`
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const salida of comprobanteSalidas.salidas) {
        for (const movimiento of salida.movimientos) {
          await queryRunner.manager.delete(Movimiento, movimiento);
        }
        await queryRunner.manager.delete(Salida, salida.id);
      }
      await queryRunner.manager.delete(
        ComprobanteSalidas,
        idComprobanteSalidas
      );
      await queryRunner.manager.delete(
        OrdenOperacion,
        comprobanteSalidas.ordenOperacion.id
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
    } finally {
      await queryRunner.release();
    }
  }

  private throwDbConstraintError(error: QueryFailedError) {
    const salidasFields = getDbErrorMsgFields(error.message, 'salidas');
    const comprobanteSalidasFields = getDbErrorMsgFields(
      error.message,
      'comprobantes_salidas'
    );

    const materialError = ['comprobantes_salidas_id', 'materiales_id'].every(
      (value) => salidasFields.includes(value)
    );

    if (materialError) {
      throw new DbConstraintError('Material duplicado');
    }

    const documentoError = ['documento'].every((value) =>
      comprobanteSalidasFields.includes(value)
    );

    if (documentoError) {
      throw new DbConstraintError('Documento duplicado');
    }
  }
}
