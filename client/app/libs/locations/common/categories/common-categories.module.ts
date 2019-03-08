import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CategoryTypePipe } from './pipes';
import { SharedModule } from '@client/app/shared/shared.module';
import {
  CategoryFormComponent,
  CategoriesActionBoxComponent,
  CategoriesCommonListComponent
} from './components';

@NgModule({
  declarations: [
    CategoryTypePipe,
    CategoryFormComponent,
    CategoriesActionBoxComponent,
    CategoriesCommonListComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  exports: [CategoryFormComponent, CategoriesActionBoxComponent, CategoriesCommonListComponent]
})
export class CommonCategoriesModule {}
