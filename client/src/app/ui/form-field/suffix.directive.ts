import { Directive } from '@angular/core';

@Directive({
  selector: '[appSuffix]',
  host: {
    'class': 'self-center',
  },
})
export class SuffixDirective {

  constructor() { }

}
