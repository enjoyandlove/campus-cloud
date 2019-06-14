import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WidthToClassPipe } from './pipes';
import { LayoutFullWidthComponent } from '@campus-cloud/layouts/cp-full-width';
import { LayoutOneColumnComponent } from '@campus-cloud/layouts/cp-one-column';
import { LayoutTwoColumnsComponent } from '@campus-cloud/layouts/cp-two-columns';

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
