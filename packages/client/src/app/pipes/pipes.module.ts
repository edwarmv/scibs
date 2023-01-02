import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NombreProveedorPipe } from './nombre-proveedor.pipe';
import { DocumentoComprobateEntradaPipe } from './documento-comprobate-entrada.pipe';
import { GestionPipe } from './gestion.pipe';

@NgModule({
  declarations: [
    NombreProveedorPipe,
    DocumentoComprobateEntradaPipe,
    GestionPipe,
  ],
  imports: [CommonModule],
  exports: [NombreProveedorPipe, DocumentoComprobateEntradaPipe, GestionPipe],
})
export class PipesModule {}
