import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        const calculo = _cantidad - value.total;
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

  async update(idSalida: number, { cantidad, comprobanteSalidas, material}: UpdateSalidaDto): Promise<void> {
    try {
      const salida = new Salida();
      salida.id = idSalida;
      salida.cantidad = cantidad;
      salida.comprobanteSalidas = comprobanteSalidas;
      salida.material = material;

    const stock = await this.stockMaterialesService.getStockMaterial(
      material.id
    );
    } catch (error) {
      
    }
  }
}
