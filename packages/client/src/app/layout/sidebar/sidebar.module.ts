import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { IconModule } from '@ui/icon/icon.module';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';
import { BadgeModule } from '@ui/badge/badge.module';
import { AvatarModule } from '@ui/avatar/avatar.module';
import { ButtonModule } from '@ui/button/button.module';
import { RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';

@NgModule({
  declarations: [SidebarComponent, SidebarItemComponent],
  imports: [
    CommonModule,
    IconModule,
    BadgeModule,
    AvatarModule,
    ButtonModule,
    RouterModule,
    RouterModule,
  ],
  exports: [SidebarComponent],
  providers: [SidebarService],
})
export class SidebarModule {}
