import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackBarService } from './snack-bar.service';
import { SnackBarComponent } from './snack-bar.component';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { ButtonModule } from '@ui/button/button.module';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  providers: [SnackBarService],
  declarations: [SnackBarComponent],
  imports: [CommonModule, MatSnackBarModule, ButtonModule, OverlayModule],
})
export class SnackbarModule {}
