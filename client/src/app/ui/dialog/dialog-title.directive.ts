import { Directive } from '@angular/core';

@Directive({
  selector: 'app-dialog-title',
  host: {
    class: 'headline cursor-default flex gap-[10px]',
  },
})
export class DialogTitleDirective {
  constructor() {}
}
