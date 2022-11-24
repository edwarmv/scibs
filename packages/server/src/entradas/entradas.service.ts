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
    proveedorId = '',
    gestionId = '',
    materialId = '',
    saldoInicial = '',
  }: {
    skip: number;
    take: number;
    term: string;
    proveedorId: string;
    gestionId: string;
    materialId: string;
    saldoInicial: string;
  }): Promise<{ values: Entrada[]; total: number }> {
    saldoInicial = saldoInicial === 'true' ? '1' : '';
    const filters: string[] = [];
    if (proveedorId) {
      filters.push('proveedor.id = :proveedorId');
    }
    if (gestionId) {
      filters.push('gestion.id = :gestionId');
    }
    if (materialId) {
      filters.push('material.id = :materialId');
    }
    if (saldoInicial) {
      filters.push('comprobanteEntradas.saldoInicial = 1');
    }
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
          filters.length > 0 ? ' AND ' : ''
        }${filters.length > 0 ? '(' + filters.join(' AND ') + ')' : ''}`,
        { proveedorId, gestionId, materialId, saldoInicial, term: `%${term}%` }
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
