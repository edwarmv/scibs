import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/auth/user.model';
import { DbConstraintError } from 'src/errors/db-constraint.error';
import { getDbErrorMsgFields } from 'src/helpers/db-error-msg.helper';
import { OrdenOperacion } from 'src/orden-operaciones/orden-operacion.entity';
import { OrdenOperacionesService } from 'src/orden-operaciones/orden-operaciones.service';
import { CreateSalidaDto } from 'src/salidas/dto/create-salida.dto';
import { SalidasService } from 'src/salidas/salidas.service';
import { Usuario } from 'src/usuarios/usuario.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { ComprobanteSalidas } from './comprobante-salidas.entity';
import { CreateComprobanteSalidasDto } from './dto/create-comprobante-salidas.dto';
import { UpdateComprobanteSalidaDto } from './dto/update-comprobante-salidas.dto';

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
      comprobanteSalidas.documento = documento;
      comprobanteSalidas.fechaSalida = fechaSalida;
      comprobanteSalidas.vencido = vencido;
      comprobanteSalidas.solicitante = solicitante;
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
        await this.salidasService.create(createSalidaDto);
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
    }: UpdateComprobanteSalidaDto
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const comprobanteSalidas = new ComprobanteSalidas();
      comprobanteSalidas.documento = documento;
      comprobanteSalidas.fechaSalida = fechaSalida;
      comprobanteSalidas.vencido = vencido;
      comprobanteSalidas.solicitante = solicitante;
      comprobanteSalidas.gestion = gestion;

      const _comprobanteSalidas = await queryRunner.manager.save(
        comprobanteSalidas
      );

      for (const salida of salidas) {
        const createSalidaDto = new CreateSalidaDto();
        createSalidaDto.cantidad = salida.cantidad;
        createSalidaDto.material = salida.material;
        createSalidaDto.comprobanteSalidas = _comprobanteSalidas;
        await this.salidasService.create(createSalidaDto);
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
