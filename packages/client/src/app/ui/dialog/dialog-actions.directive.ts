import { Directive } from '@angular/core';

@Directive({
  selector: 'app-dialog-actions',
  host: {
    class: 'flex gap-[10px] justify-end'
  }
})
export class DialogActionsDirective {

  constructor() { }

}
