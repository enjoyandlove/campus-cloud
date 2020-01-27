import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextEditorDirective } from './text-editor/text-editor.directive';

@NgModule({
  exports: [TextEditorDirective],
  declarations: [TextEditorDirective],
  imports: [CommonModule]
})
export class TextEditorModule {}
