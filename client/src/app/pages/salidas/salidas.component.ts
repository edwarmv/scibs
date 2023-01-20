import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ComprobantesSalidasService } from 'src/app/services/comprobantes-salidas.service';
import { SalidasService } from 'src/app/services/salidas.service';
import { SolicitantesService } from 'src/app/services/solicitantes.service';
import { ComprobantesSalidasComponent } from './comprobantes-salidas/comprobantes-salidas.component';
import { SalidasComponent as SalidasComponentChild } from './salidas/salidas.component';
import { SolicitantesComponent } from './solicitantes/solicitantes.component';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss'],
})
export class SalidasComponent implements OnInit {
  actions: TemplateRef<any>[] = [];
  browser: TemplateRef<any> | null = null;
  filters: TemplateRef<any>[] = [];

  totalSalidas = 0;
  totalSolicitantes = 0;
  totalComprobantes = 0;

  unsubscribe$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private salidasService: SalidasService,
    private solicitantesService: SolicitantesService,
    private comprobantesSalidasService: ComprobantesSalidasService
  ) {}

  ngOnInit(): void {
    this.salidasService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalSalidas = total));

    this.solicitantesService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalSolicitantes = total));

    this.comprobantesSalidasService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalComprobantes = total));
  }

  onActivate(component: unknown) {
    this.actions = [];
    this.browser = null;
    this.filters = [];
    if (component instanceof SalidasComponentChild) {
      this.actions = [
        component.verMaterialAction,
        component.verEntradasAction,
        component.verSaldosAction,
        component.registrarSalidasAction,
      ];
      this.browser = component.browser;
      this.filters = [
        component.materialesFilter,
        component.gestionesFilter,
      ];
    } else if (component instanceof SolicitantesComponent) {
      this.actions = [component.createSolicitanteButton];
      this.browser = component.filterInput;
    } else if (component instanceof ComprobantesSalidasComponent) {
      this.actions = [component.createComprobanteSalidasButton];
      this.browser = component.filterInput;
      this.filters = [
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
