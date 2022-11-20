import {
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, InjectionToken, Injector } from '@angular/core';
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
    if (opts.duration) {
      this.timeoutID = setTimeout(() => {
        this.overlayRef.dispose();
      }, opts.duration);
    }
  }

  close() {
    this.overlayRef.dispose();
  }
}
