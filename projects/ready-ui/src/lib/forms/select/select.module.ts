import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextModule } from '../../text/text.module';
import { SelectComponent } from './select/select.component';
import { OptionComponent } from './option/option.component';
import { PopoverModule } from '../../overlays/popover/popover.module';
import { IconsModule } from './../../images-and-icons/icons/icons.module';
import { OptionGroupComponent } from './option-group/option-group.component';

@NgModule({
  exports: [SelectComponent, OptionComponent, OptionGroupComponent],
  declarations: [SelectComponent, OptionComponent, OptionGroupComponent],
  imports: [CommonModule, IconsModule, PopoverModule, TextModule]
})
export class SelectModule {}
