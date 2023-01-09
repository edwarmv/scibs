import {
  Component,
  Input,
  OnInit,
  SkipSelf,
} from '@angular/core';
import { DropdownService } from '@ui/dropdown.service';

export type DropdownItem<T> = {
  label: string;
  value: T;
};

@Component({
  selector: 'app-dropdown-item',
  templateUrl: './dropdown-item.component.html',
  styleUrls: ['./dropdown-item.component.scss'],
})
export class DropdownItemComponent<T> implements OnInit {
  @Input()
  value: DropdownItem<T>;

  constructor(@SkipSelf() public dropdownService: DropdownService<T>) {}

  selectItem() {
    if (this.value) {
      this.dropdownService.selectedItem = this.value;
    }
  }

  ngOnInit(): void {}
}
