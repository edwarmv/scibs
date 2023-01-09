import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenOperacion } from './orden-operacion.entity';

@Injectable()
export class OrdenOperacionesService {
  constructor(
    @InjectRepository(OrdenOperacion)
    private ordenOperacionRepository: Repository<OrdenOperacion>
  ) {}

  async getLastOrdenOperacion(): Promise<number> {
    const [lastOrdenOperacion] = await this.ordenOperacionRepository.find({
      order: { orden: 'DESC' },
      take: 1,
    });

    if (lastOrdenOperacion) {
      return lastOrdenOperacion.orden;
    } else {
      return 0;
    }
  }

  async remove(idOrdenOperacion: number): Promise<void> {
    await this.ordenOperacionRepository.delete(idOrdenOperacion);
  }
}
