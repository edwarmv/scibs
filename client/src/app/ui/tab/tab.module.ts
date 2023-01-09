import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';
import { TabItemComponent } from './tab-item/tab-item.component';
import { BadgeModule } from '@ui/badge/badge.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TabComponent,
    TabItemComponent
  ],
  imports: [
    CommonModule,
    BadgeModule,
    RouterModule,
  ],
  exports: [
    TabComponent,
    TabItemComponent
  ]
})
export class TabModule { }
