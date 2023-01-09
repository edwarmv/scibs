import { Directive } from '@angular/core';

@Directive({
  selector: 'app-hint',
  host: {
    'class': 'text-gray-300 font-semibold text-xs'
  }
})
export class HintDirective {

  constructor() { }

}
