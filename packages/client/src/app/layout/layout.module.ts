import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from './sidebar/sidebar.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SidebarModule],
  exports: [SidebarModule],
})
export class LayoutModule {}
