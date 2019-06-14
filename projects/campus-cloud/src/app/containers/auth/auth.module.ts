import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './login';
import { LogoutComponent } from './logout';
import { AuthService } from './auth.service';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LostPasswordComponent } from './lost-password';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';

@NgModule({
  declarations: [LoginComponent, LogoutComponent, LostPasswordComponent],
  imports: [BrowserModule, ReactiveFormsModule, LayoutsModule, SharedModule, RouterModule],
  providers: [AuthService]
})
export class AuthModule {}
