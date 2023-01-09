import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ComprobantesEntradasService } from 'src/app/services/comprobantes-entradas.service';
import { EntradasService } from 'src/app/services/entradas.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { ComprobantesEntradasComponent } from './comprobantes-entradas/comprobantes-entradas.component';
import { EntradasComponent as EntradasComponentChild } from './entradas/entradas.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss'],
})
export class EntradasComponent implements OnInit, OnDestroy {
  actions: TemplateRef<any>[] = [];
  browser: TemplateRef<any> | null = null;
  filters: TemplateRef<any>[] = [];

  totalEntradas = 0;
  totalProveedores = 0;
  totalComprobantes = 0;

  unsubscribe$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private entradasService: EntradasService,
    private proveedoresService: ProveedoresService,
    private comprobantesEntradasService: ComprobantesEntradasService
  ) {}

  ngOnInit(): void {
    this.entradasService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalEntradas = total));

    this.proveedoresService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalProveedores = total));

    this.comprobantesEntradasService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalComprobantes = total));
  }

  onActivate(component: unknown) {
    this.actions = [];
    this.browser = null;
    this.filters = [];
    if (component instanceof EntradasComponentChild) {
      this.actions = [
        component.cargarSaldosAction,
        component.verMaterialAction,
        component.verSalidasAction,
        component.verSaldosAction,
        component.registrarEntradasAction,
      ];
      this.browser = component.browser;
      this.filters = [
        component.saldosInicialesFilter,
        component.saldosGestionAnteriorFilter,
        component.materialesFilter,
        component.gestionesFilter,
      ];
    } else if (component instanceof ProveedoresComponent) {
      this.actions = [component.createProveedorButton];
      this.browser = component.filterInput;
    } else if (component instanceof ComprobantesEntradasComponent) {
      this.actions = [
        component.cargarSaldosAction,
        component.createComprobanteEntradasButton,
      ];
      this.browser = component.filterInput;
      this.filters = [
        component.saldosInicialesFilter,
        component.saldosGestionAnteriorFilter,
        component.gestionesFilter,
      ];
    }
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
