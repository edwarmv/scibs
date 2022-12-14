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
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';
import { DialogModule } from '@ui/dialog/dialog.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { InputModule } from '@ui/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarItemComponent,
    UsuarioDialogComponent,
  ],
  imports: [
    CommonModule,
    IconModule,
    BadgeModule,
    AvatarModule,
    ButtonModule,
    RouterModule,
    DialogModule,
    ReactiveFormsModule,
    FormFieldModule,
    InputModule,
  ],
  exports: [SidebarComponent],
  providers: [SidebarService],
})
export class SidebarModule {}
