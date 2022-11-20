import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrada } from './entrada.entity';

@Injectable()
export class EntradasService {
  constructor(
    @InjectRepository(Entrada) private entradaRepository: Repository<Entrada>
  ) {}

  async findAll({
    skip = 0,
    take = 5,
    term = '',
    gestionId = '',
    materialId = '',
    saldoInicial = '',
  }: {
    skip: number;
    take: number;
    term: string;
    gestionId: string;
    materialId: string;
    saldoInicial: string;
  }): Promise<{ values: Entrada[]; total: number }> {
    saldoInicial = saldoInicial === 'true' ? '1' : '';
    const [values, total] = await this.entradaRepository
      .createQueryBuilder('entrada')
      .leftJoinAndSelect('entrada.material', 'material')
      .leftJoinAndSelect('entrada.comprobanteEntradas', 'comprobanteEntradas')
      .leftJoinAndSelect('comprobanteEntradas.gestion', 'gestion')
      .leftJoinAndSelect('comprobanteEntradas.proveedor', 'proveedor')
      .leftJoinAndSelect('comprobanteEntradas.ordenOperacion', 'ordenOperacion')
      .skip(skip)
      .take(take)
      .where(
        `(STRFTIME('%d/%m/%Y', comprobanteEntradas.fechaEntrada) LIKE :term OR proveedor.nombre LIKE :term OR comprobanteEntradas.documento LIKE :term)${
          gestionId || materialId || saldoInicial ? ' AND (' : ''
        }${gestionId ? 'gestion.id = :gestionId' : ''}${
          gestionId && materialId ? ' AND ' : ''
        }${materialId ? 'material.id = :materialId' : ''}${
          gestionId && materialId && saldoInicial ? ' AND ' : ''
        }${saldoInicial ? 'comprobanteEntradas.saldoInicial = 1' : ''}${
          gestionId || materialId || saldoInicial ? ')' : ''
        }`,
        { gestionId, materialId, saldoInicial, term: `%${term}%` }
      )
      .orderBy('comprobanteEntradas.fechaEntrada', 'ASC')
      .addOrderBy('ordenOperacion.orden', 'ASC')
      .getManyAndCount();
    return { values, total };
  }

  async getStockOfMaterial(idMaterial: number): Promise<number> {
    const stockOfMaterial = Number(
      Object.values(
        await this.entradaRepository
          .createQueryBuilder('entrada')
          .leftJoin('entrada.movimientos', 'movimientos')
          .leftJoin('entrada.material', 'material')
          .select(
            'SUM(entrada.cantidad) - IFNULL(SUM(movimientos.cantidad), 0)'
          )
          .andWhere('material.id = :idMaterial', { idMaterial })
          .getRawOne()
      )[0]
    );
    return stockOfMaterial;
  }
}
