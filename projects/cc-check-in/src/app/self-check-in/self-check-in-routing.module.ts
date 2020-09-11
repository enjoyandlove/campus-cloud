import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SelfCheckInComponent } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.component';

const routes: Routes = [
  {
    path: '',
    component: SelfCheckInComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SelfCheckInRoutingModule { }
