import { Directive } from '@angular/core';

@Directive({
  selector: '[appPrefix]',
  host: {
    'class': 'self-center',
  },
})
export class PrefixDirective {

  constructor() { }

}
