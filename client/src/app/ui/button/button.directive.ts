import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Size = 'sm' | 'md';
type Color = 'basic' | 'primary' | 'secondary' | 'error' | 'warning';

@Directive({
  selector: '[appButton]',
  host: {
    class:
      'm-1 rounded-xl flex items-center justify-center focus:ring-4 transition hover:opacity-75 disabled:opacity-40 outline-none',
    '[class.button-small]': "size === 'sm'",
    '[class.button-medium]': "size === 'md'",
  },
})
export class ButtonDirective implements OnInit, OnDestroy {
  size$ = new BehaviorSubject<Size>('sm');

  color$ = new BehaviorSubject<Color>('basic');

  @Input()
  set size(size: Size) {
    this.size$.next(size);
  }
  get size() {
    return this.size$.getValue();
  }

  @Input()
  set color(color: Color) {
    this.color$.next(color);
  }

  constructor(private el: ElementRef<HTMLButtonElement>) {}

  ngOnInit(): void {
    this.size$.subscribe(this.changeSize);
    this.color$.subscribe(this.changeColor);
  }

  changeSize = (size: Size): void => {
    const smClasses = ['text-xs', 'p-2', 'gap-2'];
    const mdClasses = ['text-sm', 'py-3.5', 'px-4', 'gap-3.5'];

    switch (size) {
      case 'sm':
        this.el.nativeElement.style.height = '32px';
        this.el.nativeElement.classList.remove(...mdClasses);
        this.el.nativeElement.classList.add(...smClasses);
        break;

      case 'md':
        this.el.nativeElement.style.height = '48px';
        this.el.nativeElement.classList.remove(...smClasses);
        this.el.nativeElement.classList.add(...mdClasses);
        break;
    }
  };

  changeColor = (color: Color) => {
    const basicClasses = ['bg-gray-150', 'text-black', 'focus:ring-gray-200'];
    const primaryClasses = ['bg-red-700', 'text-white', 'focus:ring-red-200'];
    const secondaryClasses = ['bg-gray-700', 'text-white', 'focus:ring-gray-200'];
    const warningClasses = ['bg-yellow-700', 'text-black', 'focus:ring-yellow-200'];

    this.el.nativeElement.classList.remove(...basicClasses, ...primaryClasses, ...warningClasses, ...secondaryClasses);
    switch (color) {
      case 'basic':
        this.el.nativeElement.classList.add(...basicClasses);
        break;

      case 'error':
      case 'primary':
        this.el.nativeElement.classList.add(...primaryClasses);
        break;

      case 'secondary':
        this.el.nativeElement.classList.add(...secondaryClasses);
        break;

      case 'warning':
        this.el.nativeElement.classList.add(...warningClasses);
        break;
    }
  };

  ngOnDestroy(): void {
    this.size$.complete();
    this.color$.complete();
  }
}

