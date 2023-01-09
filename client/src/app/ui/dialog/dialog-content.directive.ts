import { Directive } from '@angular/core';

@Directive({
  selector: 'app-dialog-content',
  host: {
    class: 'flex flex-col gap-[10px]'
  }
})
export class DialogContentDirective {

  constructor() { }

}
