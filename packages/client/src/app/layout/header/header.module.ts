import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { HeaderFilterDirective } from './header-filter.directive';
import { HeaderBrowserDirective } from './header-browser.directive';
import { HeaderActionDirective } from './header-action.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderFilterDirective,
    HeaderBrowserDirective,
    HeaderActionDirective,
  ],
  imports: [CommonModule],
  exports: [
    HeaderComponent,
    HeaderFilterDirective,
    HeaderBrowserDirective,
    HeaderActionDirective,
  ],
})
export class HeaderModule {}
