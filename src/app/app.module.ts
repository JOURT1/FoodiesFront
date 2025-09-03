import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FoodieApplicationComponent } from './components/foodie-application/foodie-application.component';
import { FoodieDashboardComponent } from './components/foodie-dashboard/foodie-dashboard.component';
import { HttpErrorInterceptor } from './interceptors/http.interceptor';
import { VisitModalComponent } from './components/visit-modal/visit-modal.component';
import { RestaurantCardComponent } from './shared/components/restaurant-card/restaurant-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    FoodieApplicationComponent,
    FoodieDashboardComponent,
    VisitModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    // PrimeNG Modules
    ButtonModule,
    InputTextModule,
    CardModule,
    TabViewModule,
    TableModule,
    BadgeModule,
    ToastModule,
    ProgressSpinnerModule,
    FileUploadModule,
    InputNumberModule,
    // Shared Components
    RestaurantCardComponent
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
