import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

let nextUniqueId = 0;

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  host: {
    class: 'flex items-center gap-4',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public readonly checkBoxControl = new FormControl(false);
  private unsubscribe$ = new Subject<void>();
  private _onChange = (value: boolean | null) => {};
  onTouched = () => {};

  id = '';

  constructor() {}

  ngOnInit(): void {
    this.id = `app-checkbox-${++nextUniqueId}`;
    this.checkBoxControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this._onChange(value);
        this.onTouched();
      });
  }

  writeValue(value: boolean | null): void {
    this.checkBoxControl.setValue(value);
  }

  registerOnChange(fn: (value: boolean | null) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.checkBoxControl.disable();
    } else {
      this.checkBoxControl.enable();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
