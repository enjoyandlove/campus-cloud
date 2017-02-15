import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LoginComponent } from './login';
import { LogoutComponent } from './logout';

import { AuthService } from './auth.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ LoginComponent, LogoutComponent ],
  imports: [ BrowserModule, ReactiveFormsModule, SharedModule ],
  providers: [ AuthService ],
})
export class AuthModule {}
