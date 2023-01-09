import {
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { startWith, Subject, takeUntil } from 'rxjs';
import { SnackBarComponent } from './snack-bar.component';

export type SnackBarOpts = {
  message: string;
  style?: 'error' | 'warning';
  duration?: number;
};

export const SNACK_BAR_DATA = new InjectionToken<SnackBarOpts>(
  'SNACK_BAR_DATA'
);

@Injectable()
export class SnackBarService {
  private overlayRef: OverlayRef;
  private timeoutID: NodeJS.Timeout;
  private unsubscribe$ = new Subject<void>();
  hoveredSubject = new Subject<boolean>();
  hovered$ = this.hoveredSubject.asObservable();

  constructor(private overlay: Overlay, private injector: Injector) {}

  open(opts: SnackBarOpts) {
    if (!!this.timeoutID) {
      clearTimeout(this.timeoutID);
    }

    if (!!this.overlayRef) {
      this.overlayRef.dispose();
    }

    const injector = Injector.create({
      parent: this.injector,
      providers: [{ provide: SNACK_BAR_DATA, useValue: opts }],
    });

    this.overlayRef = this.overlay.create({
      positionStrategy: new GlobalPositionStrategy()
        .centerHorizontally()
        .bottom(),
    });
    const snackBarComponentPortal = new ComponentPortal(
      SnackBarComponent,
      null,
      injector
    );
    this.overlayRef.attach(snackBarComponentPortal);
    this.hovered$
      .pipe(startWith(null), takeUntil(this.unsubscribe$))
      .subscribe((hovered) => {
        if (hovered === null && opts.duration) {
          this.timeoutID = setTimeout(() => {
            this.unsubscribe$.next();
            this.overlayRef.dispose();
          }, opts.duration);
        }
        if (hovered === true) {
          clearTimeout(this.timeoutID);
        }
        if (hovered === false) {
          this.unsubscribe$.next();
          this.overlayRef.dispose();
        }
      });
  }

  close() {
    this.unsubscribe$.next();
    this.overlayRef.dispose();
  }
}
