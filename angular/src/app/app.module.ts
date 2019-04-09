import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';


import { FooterModule } from './shared/footer/footer.module';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';

import { AppRoutes } from './app.routing';
import { SidebarModule } from './Menu/left/sidebar.module';

import { FixedpluginModule } from './Menu/right/fixedplugin.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './recursos/authInterceptor';
import { LoginComponent } from './pages/login/login.component';
import { FixedpluginComponent } from './Menu/right/fixedplugin.component';
import { NavbarComponent } from './Menu/up/navbar.component';


import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';


@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ]
})
export class MaterialModule {}

@NgModule({
    imports:      [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpModule,
        MaterialModule,
        MatNativeDateModule,
        SidebarModule,
        FooterModule,
        HttpClientModule,
        NgProgressModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        FixedpluginComponent,
        NavbarComponent
    ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }    
  ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
