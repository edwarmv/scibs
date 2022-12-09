import {
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropdownService } from '@ui/dropdown.service';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { DropdownItem } from './dropdown-item/dropdown-item.component';
import { DropdownDataSource } from './dropdown.data-source';

let dropdownMenuIndex = 0;

let dropdownButtonIndex = 0;

export type DropdownDataCb<T> = ({
  skip,
  take,
  term,
}: {
  skip: number;
  take: number;
  term: string;
}) => Observable<{ values: DropdownItem<T>[]; total: number }>;

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [DropdownService],
})
export class DropdownComponent<T> implements OnInit, OnDestroy {
  private readonly ngUnsubscribe$: Subject<void> = new Subject<void>();

  @Input()
  data: DropdownItem<T>[] = [];

  @Input()
  dataCb?: DropdownDataCb<T>;
  dataSource: DropdownDataSource<T>;

  @Input()
  set defaultValue(value: DropdownItem<T> | null) {
    this._defaultValue = value;
    if (value) {
      this.valueChange.emit(value.value);
    }
  }
  get defaultValue() {
    return this._defaultValue;
  }
  private _defaultValue: DropdownItem<T> | null;

  @Output()
  valueChange = new EventEmitter<T | null>();

  dropdownButtonId = '';
  dropdownMenuId = '';

  @Input()
  showFilter = false;
  @Input()
  filterPlaceholder = '';

  @Input()
  showClearSelectionBtn = false;
  clearSelectionBtnState = false;
  @Input()
  emptyValueLabel = 'Seleccione una opción';

  form: FormGroup<{
    term: FormControl<string>;
  }>;

  @ViewChild('dropdownButton')
  dropdownButton: ElementRef<HTMLDivElement> | undefined;

  _dropdownMenu: ElementRef<HTMLDivElement> | undefined;

  @ViewChild('dropdownMenu')
  set dropdownMenu(value: ElementRef<HTMLDivElement> | undefined) {
    if (value) {
      const dropdownMenuPosition = this.getDropdownMenuPosition(value);
      if (dropdownMenuPosition === 'left') {
        value.nativeElement.classList.add('right-0');
      }
    }
    this._dropdownMenu = value;
  }
  get dropdownMenu(): ElementRef<HTMLDivElement> | undefined {
    return this._dropdownMenu;
  }

  showDropdownMenu$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    @Host() private dropdownService: DropdownService<T>
  ) {
    this.dropdownMenuId = `dropdowm-menu-${dropdownMenuIndex}`;
    this.dropdownButtonId = `dropdowm-button-${dropdownButtonIndex++}`;
  }

  onClickDropdownButton() {
    this.showDropdownMenu = !this.showDropdownMenu;
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      term: [''],
    });

    document.addEventListener('click', this.onCloseDropdownMenu);

    if (this.dataCb) {
      this.dataSource = new DropdownDataSource<T>(this.dataCb);
      if (this.showFilter) {
        this.term?.valueChanges.subscribe((term) => {
          this.dataSource.term = term;
        });
      }
    }

    this.dropdownService.selectedItem$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value) => {
        this._defaultValue = value;
        this.showDropdownMenu = false;
        this.valueChange.emit(value.value);
        if (this.dataCb && this.showFilter) {
          this.term?.reset();
        }
      });
  }

  clearSelection() {
    this._defaultValue = null;
    this.valueChange.emit(null);
  }

  onCloseDropdownMenu = (e: MouseEvent) => {
    // REF: https://linguinecode.com/post/how-to-close-popup-by-clicking-outside-with-javascript
    const isDropdownMenu = !!(e.target as HTMLElement).closest(
      `#${this.dropdownMenuId}`
    );
    const isDropdownButton = !!(e.target as HTMLElement).closest(
      `#${this.dropdownButtonId}`
    );
    if (!isDropdownMenu && !isDropdownButton && this.showDropdownMenu) {
      this.showDropdownMenu = false;
    }
  };

  getDropdownMenuPosition(
    dropdownMenu: ElementRef<HTMLDivElement>
  ): 'left' | 'right' {
    if (this.dropdownButton && dropdownMenu) {
      const { x: dropdownX } =
        this.dropdownButton.nativeElement.getBoundingClientRect();
      const { width: dropdownMenuWidth } =
        dropdownMenu.nativeElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      if (windowWidth - dropdownX >= dropdownMenuWidth) {
        return 'right';
      } else {
        return 'left';
      }
    } else {
      return 'left';
    }
  }

  set showDropdownMenu(value: boolean) {
    this.showDropdownMenu$.next(value);
  }

  get showDropdownMenu(): boolean {
    return this.showDropdownMenu$.getValue();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.unsubscribe();
    document.removeEventListener('click', this.onCloseDropdownMenu);
  }

  get term() {
    return this.form.get('term');
  }
}
