import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from './button.directive';
import { ButtonOutlineDirective } from './button-outline.directive';
import { IconButtonDirective } from './icon-button.directive';

@NgModule({
  declarations: [ButtonDirective, ButtonOutlineDirective, IconButtonDirective],
  imports: [CommonModule],
  exports: [ButtonDirective, ButtonOutlineDirective, IconButtonDirective],
})
export class ButtonModule {}
