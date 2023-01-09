import { Directive } from '@angular/core';
import { AbstractControlDirective, NgControl } from '@angular/forms';

@Directive()
export abstract class FormFieldControlDirective {
  readonly ngControl: NgControl | AbstractControlDirective | null = null;
  readonly id: string = '';
  readonly focused: boolean = false;
}
