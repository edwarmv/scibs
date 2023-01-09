import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrefixDirective } from './prefix.directive';
import { SuffixDirective } from './suffix.directive';
import { HintDirective } from './hint.directive';
import { ErrorDirective } from './error.directive';
import { LabelDirective } from './label.directive';
import { FormFieldComponent } from './form-field.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    FormFieldComponent,
    PrefixDirective,
    SuffixDirective,
    HintDirective,
    ErrorDirective,
    LabelDirective,
  ],
  imports: [CommonModule, OverlayModule],
  exports: [
    FormFieldComponent,
    PrefixDirective,
    SuffixDirective,
    HintDirective,
    ErrorDirective,
    LabelDirective,
  ],
})
export class FormFieldModule {}
