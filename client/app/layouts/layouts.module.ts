import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidthToClassPipe } from './pipes';
import { LayoutFullWidthComponent } from '@app/layouts/cp-full-width';
import { LayoutOneColumnComponent } from '@app/layouts/cp-one-column';
import { LayoutTwoColumnsComponent } from '@app/layouts/cp-two-columns';

@NgModule({
  declarations: [
    WidthToClassPipe,
    LayoutOneColumnComponent,
    LayoutTwoColumnsComponent,
    LayoutFullWidthComponent
  ],
  imports: [CommonModule],
  exports: [LayoutOneColumnComponent, LayoutTwoColumnsComponent, LayoutFullWidthComponent]
})
export class LayoutsModule {}
