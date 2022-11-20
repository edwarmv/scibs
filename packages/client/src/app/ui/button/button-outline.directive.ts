import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Size = 'sm' | 'md';
type Color = 'basic' | 'primary' | 'error' | 'warning';

@Directive({
  selector: '[appButtonOutline]',
  host: {
    class:
      'transition m-1 ring-1 ring-gray-150 rounded-xl inline-flex items-center hover:opacity-75 focus:ring-2 disabled:opacity-40 outline-none',
    '[class.button-small]': "size === 'sm'",
    '[class.button-medium]': "size === 'md'",
  },
})
export class ButtonOutlineDirective implements OnInit, OnDestroy {
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
    const basicClasses = ['text-black', 'focus:ring-gray-150'];
    const primaryClasses = [
      'text-red-700',
      'hover:ring-red-700',
      'focus:ring-red-700',
    ];

    switch (color) {
      case 'basic':
        this.el.nativeElement.classList.remove(...primaryClasses);
        this.el.nativeElement.classList.add(...basicClasses);
        break;

      case 'primary':
        this.el.nativeElement.classList.remove(...basicClasses);
        this.el.nativeElement.classList.add(...primaryClasses);
        break;
    }
  };

  ngOnDestroy(): void {
    this.size$.complete();
    this.color$.complete();
  }
}
