import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormFieldControlDirective } from '@ui/form-field/form-field-control.directive';
import { BehaviorSubject } from 'rxjs';

let nextUniqueId = 0;

@Directive({
  selector: 'input[appInput]',
  host: {
    class: `grow
w-full
text-black
focus:outline-none
placeholder:opacity-0
placeholder:text-gray-300
font-bold
focus:placeholder:opacity-100
placeholder:font-normal
placeholder:text-sm
disabled:bg-white`,
    '[attr.id]': 'id',
    '(focus)': '_focusChanged(true)',
    '(blur)': '_focusChanged(false)',
  },
  providers: [
    { provide: FormFieldControlDirective, useExisting: InputDirective },
  ],
})
export class InputDirective implements FormFieldControlDirective {
  @Input()
  set id(value: string) {
    this._id = value;
  }
  get id(): string {
    return this._id;
  }
  _id: string = '';

  focused: boolean = false;
  focused$ = new BehaviorSubject<boolean>(false);

  @HostBinding('attr.autocomplete') autocomplete = 'off';

  constructor(
    public el: ElementRef<HTMLInputElement>,
    private control: NgControl
  ) {
    this._id = `app-input-${nextUniqueId++}`;
  }

  _focusChanged(isFocused: boolean) {
    if (isFocused !== this.focused) {
      this.focused = isFocused;
      this.focused$.next(isFocused);
    }
  }

  get ngControl() {
    return this.control;
  }
}
