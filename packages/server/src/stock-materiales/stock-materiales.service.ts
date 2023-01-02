import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { StockMaterial } from './stock-material.entity';

@Injectable()
export class StockMaterialesService {
  constructor(
    @InjectRepository(StockMaterial)
    private stockMaterialRepository: Repository<StockMaterial>,
    private dataSource: DataSource
  ) {}

  async findAll({
    skip = 0,
    take = 5,
    term = '',
    idGestion = '',
    idMaterial = '',
    saldosNulos = '',
    conSaldo = '',
    saldosIniciales = '',
    saldosGestionAnterior = '',
  }: {
    skip?: number;
    take?: number;
    term?: string;
    idGestion?: string;
    idMaterial?: string;
    saldosNulos?: string;
    conSaldo?: string;
    saldosIniciales?: string;
    saldosGestionAnterior?: string;
  } = {}): Promise<{ values: StockMaterial[]; total: number }> {
    const filters: string[] = [];

    if (idGestion) {
      filters.push('stockMaterial.idGestion = :idGestion');
    }

    if (idMaterial) {
      filters.push('stockMaterial.idMaterial = :idMaterial');
    }

    if (saldosNulos === 'true') {
      filters.push('stockMaterial.stock = 0');
    }

    if (conSaldo === 'true') {
      filters.push('stockMaterial.stock > 0');
    }

    if (saldosIniciales === 'true') {
      filters.push('stockMaterial.saldoInicial = 1');
    }

    if (saldosGestionAnterior === 'true') {
      filters.push('stockMaterial.saldoGestionAnterior = 1');
    }

    const [values, total] = await this.stockMaterialRepository
      .createQueryBuilder('stockMaterial')
      .skip(skip)
      .take(take)
      .where(
        `(STRFTIME('%d/%m/%Y', stockMaterial.fechaEntrada) LIKE :term
            OR
              stockMaterial.nombreProveedor LIKE :term
            OR
              COALESCE(stockMaterial.documentoComprobanteEntradas, '000-' || stockMaterial.idComprobanteEntradas) LIKE :term)${
                filters.length > 0
                  ? ' AND ' + '(' + filters.join(' AND ') + ')'
                  : ''
              }`,
        {
          idGestion,
          idMaterial,
          term: `%${term}%`,
        }
      )
      .getManyAndCount();
    return { values, total };
  }

  async findOne(idMaterial: number): Promise<StockMaterial> {
    return this.stockMaterialRepository.findOneBy({ idMaterial });
  }

  async getStockMaterial(
    idMaterial: number,
    { idGestion = '' }: { idGestion?: string } = {}
  ): Promise<number> {
    const { stock }: { stock: number } = await this.stockMaterialRepository
      .createQueryBuilder('stockMaterial')
      .select('SUM(stockMaterial.stock)', 'stock')
      .where(
        `stockMaterial.stock > 0 AND stockMaterial.idMaterial = :idMaterial ${
          idGestion ? ' AND stockMaterial.idGestion = :idGestion' : ''
        }`,
        { idMaterial, idGestion }
      )
      .andWhere('stockMaterial.idMaterial = :idMaterial', { idMaterial })
      .getRawOne();
    return Number(stock);
  }

  async getStockMaterialByCantidad(
    idMaterial: number,
    cantidad: number,
    idGestion: number
  ): Promise<(StockMaterial & { total: number; row_num: number })[]> {
    const _idMaterial = Number(idMaterial) || 0;
    const _cantidad = Number(cantidad) || 0;
    return this.dataSource.query(`
WITH
  sm as (
    SELECT
      *,
      SUM(sm2.stock) OVER (
        ROWS BETWEEN UNBOUNDED PRECEDING
        AND CURRENT ROW
      ) AS total,
      ROW_NUMBER() OVER () row_num
    FROM
      stock_materiales sm2
    WHERE
      sm2.stock > 0
        AND
      sm2.idMaterial = ${_idMaterial}
        AND
      sm2.idGestion = ${idGestion}
  )
SELECT
  *
FROM
  sm
WHERE
  sm.row_num <= (
    SELECT
      sm3.row_num
    FROM
      sm sm3
    WHERE
      sm3.total >= ${_cantidad}
    LIMIT
      1
  );
    `);
  }
}
