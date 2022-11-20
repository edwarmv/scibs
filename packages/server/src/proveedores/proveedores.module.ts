import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],
  providers: [ProveedoresService],
  controllers: [ProveedoresController],
})
export class ProveedoresModule {}
