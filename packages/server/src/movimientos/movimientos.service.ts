import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { Movimiento } from './movimiento.entity';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private movimientoRepository: Repository<Movimiento>
  ) {}

  async create({
    entrada,
    salida,
    cantidad,
  }: CreateMovimientoDto): Promise<Movimiento> {
    const movimiento = new Movimiento();
    movimiento.entrada = entrada;
    movimiento.salida = salida;
    movimiento.cantidad = cantidad;

    return this.movimientoRepository.save(movimiento);
  }

  async getLastOrdenMovimiento(): Promise<number> {
    const [lastMovimiento] = await this.movimientoRepository.find({
      order: { orden: 'DESC' },
    });

    if (lastMovimiento) {
      return lastMovimiento.orden;
    } else {
      return 0;
    }
  }
}
