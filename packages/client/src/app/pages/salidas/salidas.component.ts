import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DropdownItem } from '@ui/dropdown/dropdown-item/dropdown-item.component';
import { Subject } from 'rxjs';
import { ComprobantesSalidasComponent } from './comprobantes-salidas/comprobantes-salidas.component';
import { SalidasComponent as SalidasComponentChild } from './salidas/salidas.component'
import { SolicitantesComponent } from './solicitantes/solicitantes.component';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss']
})
export class SalidasComponent implements OnInit {
  actions: TemplateRef<any>[] = [];
  browser: TemplateRef<any> | null = null;
  filters: TemplateRef<any>[] = [];

  totalEntradas = 0;
  totalProveedores = 0;
  totalComprobantes = 0;

  unsubscribe$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    // private entradasService: EntradasService,
    // private proveedoresService: ProveedoresService,
    // private comprobantesEntradasService: ComprobantesEntradasService
  ) {}

  ngOnInit(): void {
    // this.entradasService.total$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((total) => (this.totalEntradas = total));
    //
    // this.proveedoresService.total$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((total) => (this.totalProveedores = total));
    //
    // this.comprobantesEntradasService.total$
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((total) => (this.totalComprobantes = total));
  }

  onActivate(component: unknown) {
    this.actions = [];
    this.browser = null;
    this.filters = [];
    if (component instanceof SalidasComponentChild) {
      // this.actions = [
      //   component.cargarSaldosAction,
      //   component.verMaterialAction,
      //   component.verSalidasAction,
      //   component.verSaldosAction,
      //   component.registrarEntradasAction,
      // ];
      // this.browser = component.browser;
      // this.filters = [
      //   component.saldosInicialesFilter,
      //   component.materialesFilter,
      //   component.gestionesFilter,
      // ];
    } else if (component instanceof SolicitantesComponent) {
      this.actions = [component.createSolicitanteButton];
      this.browser = component.filterInput;
    } else if (component instanceof ComprobantesSalidasComponent) {
      this.actions = [component.createComprobanteSalidasButton];
      this.browser = component.filterInput;
    }
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
