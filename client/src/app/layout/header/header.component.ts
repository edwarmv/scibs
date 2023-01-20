import {
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
} from '@angular/core';
import { HeaderActionDirective } from './header-action.directive';
import { HeaderBrowserDirective } from './header-browser.directive';
import { HeaderFilterDirective } from './header-filter.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ContentChildren(HeaderActionDirective)
  actions: QueryList<HeaderActionDirective>;

  @ContentChild(HeaderBrowserDirective)
  browser: HeaderBrowserDirective;

  @ContentChildren(HeaderFilterDirective)
  filters: QueryList<HeaderFilterDirective>;

  @Input()
  headerTitle = '';

  constructor() {}
  ngOnInit(): void {
  }
}
