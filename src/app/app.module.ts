import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AlertModule } from './helpers/alert/alert.module';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

//DatetimePicker module
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';

//Angular Material.
import { DemoMaterialModule } from './material-module';
import { MatSortModule } from '@angular/material/sort';

//component
import { AppComponent } from './app.component';
import { HomeComponent } from './components/Home/home.component';
import { LoginComponent } from './components/Login/login.component';
import { AdminComponent } from './components/Admin/admin.component';
import { TestsComponent } from './components/Tests/tests.component';
import { CreateUserDialogComponent } from './components/createUserDialog/create-user-dialog.component';
import { ConfirmationDialogComponent } from './components/confirmationDialog/confirmation-dialog.component';
import { NewTestComponent } from './components/Tests/NewTestComponent/newTest.component';

@NgModule({
  imports: [
    DemoMaterialModule,
    MatSortModule,
    AlertModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    TestsComponent,
    NewTestComponent,
    CreateUserDialogComponent,
    ConfirmationDialogComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
