import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  ElementRef,
  HostListener,
  InjectionToken,
  Injector,
  Input,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { TooltipComponent } from './tooltip.component';

export type TooltipOpts = {
  content: Observable<string>;
};

export const TOOLTIP_DATA = new InjectionToken<TooltipOpts>('TOOLTIP_DATA');

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  private _overlayRef: OverlayRef;

  @Input()
  appTooltip: string | Observable<string> = '';

  @HostListener('mouseenter') mouseEnter() {
    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withPositions([
        {
          // here, top-left of the overlay is connected to bottom-left of the origin;
          // of course, you can change this object or generate it dynamically;
          // moreover, you can specify multiple objects in this array for CDK to find the most suitable option
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
        },
      ]);
    this._overlayRef = this._overlay.create({ positionStrategy: strategy });
    const injector = Injector.create({
      parent: this._injector,
      providers: [
        {
          provide: TOOLTIP_DATA,
          useValue: {
            content:
              this.appTooltip instanceof Observable
                ? this.appTooltip
                : of(this.appTooltip),
          },
        },
      ],
    });
    const tooltipComponentPortal = new ComponentPortal(
      TooltipComponent,
      null,
      injector
    );
    this._overlayRef.attach(tooltipComponentPortal);
  }

  @HostListener('mouseleave') mouseLeave() {
    this._overlayRef.dispose();
  }

  constructor(
    private _injector: Injector,
    private _overlay: Overlay,
    private _elementRef: ElementRef<HTMLElement>
  ) {
    // this._overlayRef = this._overlay.create();
    // const tooltipComponentPortal = new ComponentPortal(TooltipComponent);
    // this._overlayRef.attach(tooltipComponentPortal);
  }
}
