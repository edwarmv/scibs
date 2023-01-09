import { Directive } from '@angular/core';

@Directive({
  selector: 'app-error',
  host: {
    'class': 'text-red-700 font-semibold text-xs',
  },
})
export class ErrorDirective {

  constructor() { }

}
