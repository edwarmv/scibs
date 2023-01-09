import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appHeaderBrowser]'
})
export class HeaderBrowserDirective {

  constructor(public templateRef: TemplateRef<unknown>) { }

}
