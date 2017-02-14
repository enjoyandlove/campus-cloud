import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LoginComponent } from './login';
import { LogoutComponent } from './logout';

import { AuthService } from './auth.service';

@NgModule({
  declarations: [ LoginComponent, LogoutComponent ],
  imports: [ BrowserModule, ReactiveFormsModule ],
  providers: [ AuthService ],
})
export class AuthModule {}
