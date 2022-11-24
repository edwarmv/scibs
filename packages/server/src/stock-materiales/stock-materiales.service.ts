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
    idMaterial,
  }: {
    idMaterial?: number;
  } = {}): Promise<StockMaterial[]> {
    if (idMaterial) {
      return this.stockMaterialRepository.find({ where: { idMaterial } });
    }
    return this.stockMaterialRepository.find();
  }

  async findOne(idMaterial: number): Promise<StockMaterial> {
    return this.stockMaterialRepository.findOneBy({ idMaterial });
  }

  async getStockMaterial(idMaterial: number): Promise<number> {
    const { stock }: { stock: number } = await this.stockMaterialRepository
      .createQueryBuilder('stockMaterial')
      .select('SUM(stockMaterial.stock)', 'stock')
      .where('stockMaterial.idMaterial = :idMaterial', { idMaterial })
      .getRawOne();
    return Number(stock);
  }

  async getStockMaterialByCantidad(
    idMaterial: number,
    cantidad: number
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
      sm2.idMaterial = ${_idMaterial}
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
