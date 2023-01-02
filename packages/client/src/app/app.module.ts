import { DEFAULT_DIALOG_CONFIG, DialogConfig } from '@angular/cdk/dialog';
import { HttpClientModule } from '@angular/common/http';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DirectivesModule } from '@directives/directives.module';
import { SnackbarModule } from '@ui/snack-bar/snack-bar.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { httpInterceptorProviders } from './http-interceptors';
import localeEs from '@angular/common/locales/es-BO';
import { registerLocaleData } from '@angular/common';
import { ConfirmDialogModule } from '@ui/confirm-dialog/confirm-dialog.module';
registerLocaleData(localeEs);
import { es } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';
setDefaultOptions({ locale: es });

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DirectivesModule,
    LayoutModule,
    HttpClientModule,
    SnackbarModule,
    ConfirmDialogModule,
  ],
  providers: [
    httpInterceptorProviders,
    { provide: LOCALE_ID, useValue: 'es-BO' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'Bs' },
    {
      provide: DEFAULT_DIALOG_CONFIG,
      useValue: {
        ...new DialogConfig(),
        panelClass: 'default-dialog-container',
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
