import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type Color = 'basic' | 'primary';

@Directive({
  selector: 'button[appIconButton]',
  host: {
    class:
      'flex rounded-md p-0.5 transition-colors hover:ring-1 outline-none disabled:text-gray-300 disabled:ring-gray-300 disabled:active:bg-gray-150',
  },
})
export class IconButtonDirective implements OnInit, OnDestroy {
  colorSubject = new BehaviorSubject<Color>('basic');
  color$ = this.colorSubject.asObservable();

  @Input()
  set color(color: Color) {
    this.colorSubject.next(color);
  }

  constructor(private el: ElementRef<HTMLButtonElement>) {}

  ngOnInit(): void {
    this.color$.subscribe(this.changeColor);
  }

  changeColor = (color: Color) => {
    const basicClasses = ['hover:ring-gray-300', 'active:bg-gray-150'];
    const primaryClasses = [
      'hover:ring-red-300',
      'active:bg-red-200',
      'active:text-red-700',
    ];
    this.el.nativeElement.classList.remove(...basicClasses, ...primaryClasses);

    switch (color) {
      case 'basic':
        this.el.nativeElement.classList.add(...basicClasses);
        break;

      case 'primary':
        this.el.nativeElement.classList.add(...primaryClasses);
        break;

      default:
        this.el.nativeElement.classList.add(...basicClasses);
        break;
    }
  };

  ngOnDestroy(): void {
    this.colorSubject.complete();
  }
}
