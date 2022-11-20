import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { InputDirective } from '@ui/input/input.directive';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  AutocompleteDataSource,
  AutocompleteDataSourceCb,
} from './autocomplete.data-source';
import { ErrorDirective } from './error.directive';
import { FormFieldControlDirective } from './form-field-control.directive';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  host: {
    class: 'flex flex-col gap-2',
  },
})
export class FormFieldComponent implements OnInit, AfterContentInit, OnDestroy {
  @ContentChild(FormFieldControlDirective) _control: FormFieldControlDirective;

  @ContentChildren(ErrorDirective) _errors: ErrorDirective[];

  @ContentChild(InputDirective) input: InputDirective;

  @Input()
  autocompleteDataCb?: AutocompleteDataSourceCb<any>;
  autocompleteDataSource: AutocompleteDataSource<any>;
  isInputFocused = false;

  @Output()
  autocompleteValueChange = new EventEmitter<any>();

  unsubscribe$ = new Subject<void>();

  constructor() {}

  ngAfterContentInit(): void {
    if (this.autocompleteDataCb) {
      this._control.ngControl?.valueChanges
        ?.pipe(takeUntil(this.unsubscribe$))
        .subscribe((term) => {
          this.autocompleteDataSource.term = term;
        });

      this.input.focused$
        .pipe(takeUntil(this.unsubscribe$), debounceTime(100))
        .subscribe((focused) => {
          this.isInputFocused = focused;
        });
    }
  }

  ngOnInit(): void {
    if (this.autocompleteDataCb) {
      this.autocompleteDataSource = new AutocompleteDataSource(
        this.autocompleteDataCb
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
