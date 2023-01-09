import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appHeaderFilter]',
})
export class HeaderFilterDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}
