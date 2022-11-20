import { Directive } from '@angular/core';

@Directive({
  selector: 'app-dialog-title',
  host: {
    class: 'headline cursor-default',
  },
})
export class DialogTitleDirective {
  constructor() {}
}
