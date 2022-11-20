import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { PartidasComponent } from './partidas/partidas.component';
import { UnidadesManejoComponent } from './unidades-manejo/unidades-manejo.component';
import { MaterialesComponent as MaterialesComponentChild } from './materiales/materiales.component';
import { MaterialesService } from 'src/app/services/materiales.service';
import { UnidadesManejoService } from 'src/app/services/unidades-manejo.service';
import { PartidasService } from 'src/app/partidas.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss'],
})
export class MaterialesComponent implements OnInit, OnDestroy {
  actions: TemplateRef<any>[] = [];
  browser: TemplateRef<any> | null;
  filters: TemplateRef<any>[] = [];

  totalMateriales = 0;
  totalUnidadesManejo = 0;
  totalPartidas = 0;

  unsubscribe$ = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private materialesService: MaterialesService,
    private unidadesManejoService: UnidadesManejoService,
    private partidasService: PartidasService
  ) {}

  ngOnInit(): void {
    this.materialesService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalMateriales = total));
    this.unidadesManejoService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalUnidadesManejo = total));
    this.partidasService.total$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((total) => (this.totalPartidas = total));
  }

  onActivate(component: unknown) {
    this.actions = [];
    this.browser = null;
    this.filters = [];
    if (component instanceof UnidadesManejoComponent) {
      this.actions = [component.createUnidadManejoButton];
      this.browser = component.filterInput;
    } else if (component instanceof PartidasComponent) {
      this.actions = [component.createPartidaButton];
      this.browser = component.filterInput;
    } else if (component instanceof MaterialesComponentChild) {
      this.actions = [component.createMaterialButton];
      this.browser = component.filterInput;
      this.filters = [component.partidaFilter];
    }
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
