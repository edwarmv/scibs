import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appHeaderAction]',
})
export class HeaderActionDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
