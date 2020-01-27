import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextModule } from '../../text/text.module';
import { PopoverModule } from '../../overlays/popover/popover.module';
import { TextFieldComponent } from './text-field/text-field.component';

@NgModule({
  exports: [TextFieldComponent],
  declarations: [TextFieldComponent],
  imports: [CommonModule, TextModule, PopoverModule]
})
export class TextFieldModule {}
