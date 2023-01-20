import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Big from 'big.js';
import { Entrada } from 'src/entradas/entrada.entity';
import { Movimiento } from 'src/movimientos/movimiento.entity';
import { MovimientosService } from 'src/movimientos/movimientos.service';
import { StockMaterialesService } from 'src/stock-materiales/stock-materiales.service';
import { DataSource, Repository } from 'typeorm';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { Salida } from './salida.entity';

@Injectable()
export class SalidasService {
  constructor(
    @InjectRepository(Salida) private salidaRepository: Repository<Salida>,
    private stockMaterialesService: StockMaterialesService,
    private movimientosService: MovimientosService,
    private dataSource: DataSource
  ) {}

  async create(
    { cantidad, comprobanteSalidas, material }: CreateSalidaDto,
    idGestion: number
  ): Promise<Salida> {
    const salida = new Salida();
    salida.cantidad = cantidad;
    salida.comprobanteSalidas = comprobanteSalidas;
    salida.material = material;

    const stock = await this.stockMaterialesService.getStockMaterial(
      material.id,
      {
        idGestion: idGestion.toString(),
      }
    );

    if (stock >= cantidad) {
      const stockMateriales =
        await this.stockMaterialesService.getStockMaterialByCantidad(
          material.id,
          cantidad,
          idGestion
        );
      let _cantidad = cantidad;
      let lastOrdenStockMateriales =
        await this.movimientosService.getLastOrdenMovimiento();
      const movimientos: Movimiento[] = stockMateriales.map((value) => {
        const movimiento = new Movimiento();
        const entrada = new Entrada();
        entrada.id = value.idEntrada;
        movimiento.entrada = entrada;
        movimiento.orden = ++lastOrdenStockMateriales;
        const calculo = new Big(_cantidad)
          .minus(new Big(value.total))
          .toNumber();
        if (calculo === 0) {
          movimiento.cantidad = value.total;
          _cantidad = 0;
        }
        if (calculo < 0) {
          movimiento.cantidad = _cantidad;
          _cantidad = 0;
        }
        if (calculo > 0) {
          movimiento.cantidad = value.total;
          _cantidad = calculo;
        }
        return movimiento;
      });
      salida.movimientos = movimientos;
      return this.salidaRepository.save(salida);
    } else {
      throw new ConflictException('Stock insuficiente');
    }
  }

  async findAll({
    skip = 0,
    take = 5,
    term = '',
    solicitanteId = '',
    gestionId = '',
    materialId = '',
  }: {
    skip: number;
    take: number;
    term: string;
    solicitanteId: string;
    gestionId: string;
    materialId: string;
  }): Promise<{ values: Salida[]; total: number }> {
    const filters: string[] = [];
    if (solicitanteId) {
      filters.push('solicitante.id = :solicitanteId');
    }
    if (gestionId) {
      filters.push('gestion.id = :gestionId');
    }
    if (materialId) {
      filters.push('material.id = :materialId');
    }
    const [values, total] = await this.salidaRepository
      .createQueryBuilder('salida')
      .leftJoinAndSelect('salida.material', 'material')
      .leftJoinAndSelect('salida.comprobanteSalidas', 'comprobanteSalidas')
      .leftJoinAndSelect('comprobanteSalidas.gestion', 'gestion')
      .leftJoinAndSelect('comprobanteSalidas.solicitante', 'solicitante')
      .leftJoinAndSelect('comprobanteSalidas.ordenOperacion', 'ordenOperacion')
      .skip(skip)
      .take(take)
      .where(
        `(
          STRFTIME('%d/%m/%Y', comprobanteSalidas.fechaSalida) LIKE :term
            OR
          solicitante.nombre LIKE :term
            OR
          COALESCE(comprobanteSalidas.documento, '000-' || comprobanteSalidas.id) LIKE :term)${
            filters.length > 0 ? ' AND ' : ''
          }${filters.length > 0 ? '(' + filters.join(' AND ') + ')' : ''}`,
        { solicitanteId, gestionId, materialId, term: `%${term}%` }
      )
      .orderBy('comprobanteSalidas.fechaSalida', 'DESC')
      .addOrderBy('ordenOperacion.orden', 'DESC')
      .getManyAndCount();
    return { values, total };
  }

  async remove(idSalida: number): Promise<void> {
    console.log(idSalida);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const salida = await this.salidaRepository.findOne({
        where: { id: idSalida },
        relations: { movimientos: true },
      });
      console.log(salida.movimientos);

      for (const movimiento of salida.movimientos) {
        await queryRunner.manager.delete(Movimiento, movimiento);
      }
      await queryRunner.manager.delete(Salida, idSalida);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('remove', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
