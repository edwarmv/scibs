import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { MaterialesModule } from './materiales/materiales.module';
import { UnidadesManejoModule } from './unidades-manejo/unidades-manejo.module';
import { PartidasModule } from './partidas/partidas.module';
import { APP_FILTER } from '@nestjs/core';
import { DbConstraintExceptionFilter } from './filters/db-constraint-error.filter';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { GestionesModule } from './gestiones/gestiones.module';
import { SolicitantesModule } from './solicitantes/solicitantes.module';
import { ComprobantesEntradasModule } from './comprobantes-entradas/comprobantes-entradas.module';
import { OrdenOperacionesModule } from './orden-operaciones/orden-operaciones.module';
import { ComprobantesSalidasModule } from './comprobantes-salidas/comprobantes-salidas.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { EntradasModule } from './entradas/entradas.module';
import { SalidasModule } from './salidas/salidas.module';
import { StockMaterialesModule } from './stock-materiales/stock-materiales.module';
import { ReportEventsModule } from './report-events/report-events.module';
import { SocketClientModule } from './socket-client/socket-client.module';
import { LoteModule } from './lote/lote.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        ENV === 'dev' ? '.dev.env' : ENV === 'prod' ? '.env' : '.env',
    }),
    MaterialesModule,
    UnidadesManejoModule,
    PartidasModule,
    ProveedoresModule,
    GestionesModule,
    SolicitantesModule,
    ComprobantesEntradasModule,
    OrdenOperacionesModule,
    ComprobantesSalidasModule,
    MovimientosModule,
    EntradasModule,
    SalidasModule,
    StockMaterialesModule,
    ReportEventsModule,
    SocketClientModule,
    LoteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: DbConstraintExceptionFilter,
    },
  ],
})
export class AppModule {}
