import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Big from 'big.js';
import { Entrada } from 'src/entradas/entrada.entity';
import { Movimiento } from 'src/movimientos/movimiento.entity';
import { MovimientosService } from 'src/movimientos/movimientos.service';
import { StockMaterialesService } from 'src/stock-materiales/stock-materiales.service';
import { Repository } from 'typeorm';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';
import { Salida } from './salida.entity';

@Injectable()
export class SalidasService {
  constructor(
    @InjectRepository(Salida) private salidaRepository: Repository<Salida>,
    private stockMaterialesService: StockMaterialesService,
    private movimientosService: MovimientosService
  ) {}

  async create({
    cantidad,
    comprobanteSalidas,
    material,
  }: CreateSalidaDto): Promise<Salida> {
    const salida = new Salida();
    salida.cantidad = cantidad;
    salida.comprobanteSalidas = comprobanteSalidas;
    salida.material = material;

    const stock = await this.stockMaterialesService.getStockMaterial(
      material.id
    );

    if (stock >= cantidad) {
      const stockMateriales =
        await this.stockMaterialesService.getStockMaterialByCantidad(
          material.id,
          cantidad
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
        const calculo = new Big(_cantidad).minus(new Big(value.total)).toNumber();
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

  async update(
    idSalida: number,
    { cantidad, comprobanteSalidas, material }: UpdateSalidaDto
  ): Promise<void> {
    try {
      const salida = new Salida();
      salida.id = idSalida;
      salida.cantidad = cantidad;
      salida.comprobanteSalidas = comprobanteSalidas;
      salida.material = material;

      const stock = await this.stockMaterialesService.getStockMaterial(
        material.id
      );
    } catch (error) {}
  }

  async findAll({
    skip = 0,
    take = 5,
    term = '',
    solicitanteId = '',
    gestionId = '',
    materialId = '',
    vencido = '',
  }: {
    skip: number;
    take: number;
    term: string;
    solicitanteId: string;
    gestionId: string;
    materialId: string;
    vencido: string;
  }): Promise<{ values: Salida[]; total: number }> {
    vencido = vencido === 'true' ? '1' : '';
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
    if (vencido) {
      filters.push('comprobanteSalidas.vencido = 1');
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
        `(STRFTIME('%d/%m/%Y', comprobanteSalidas.fechaSalida) LIKE :term OR solicitante.nombre LIKE :term OR comprobanteSalidas.documento LIKE :term)${
          filters.length > 0 ? ' AND ' : ''
        }${filters.length > 0 ? '(' + filters.join(' AND ') + ')' : ''}`,
        { solicitanteId, gestionId, materialId, vencido, term: `%${term}%` }
      )
      .orderBy('comprobanteSalidas.fechaSalida', 'ASC')
      .addOrderBy('ordenOperacion.orden', 'ASC')
      .getManyAndCount();
    return { values, total };
  }
}
