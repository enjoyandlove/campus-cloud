import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockType, FormBlock } from '../../../models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services';

@Component({
  selector: 'cp-form-block-header',
  templateUrl: './form-block-header.component.html',
  styleUrls: ['./form-block-header.component.scss']
})
export class FormBlockHeaderComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() indexPos: number;
  @Output() deleteClicked = new EventEmitter<any>();
  blockType = BlockType;
  blockTypeToIconMap: {} = {
    [BlockType.text]: 'text_input',
    [BlockType.number]: 'numeric_input',
    [BlockType.decimal]: 'decimal_input',
    [BlockType.multiple_choice]: 'multiple_choice',
    [BlockType.multiple_selection]: 'multiple_selection',
    [BlockType.yes_no]: 'checkbox_checked',
    [BlockType.image]: 'square'
  };

  constructor() {}

  ngOnInit(): void {}

  deleteClickHandler(): void {
    this.deleteClicked.emit();
  }

  logicClickHandler(): void {
    if (this.formBlock.is_terminal) {
      this.toggleLogicForResultBlocks();
    } else {
      this.toggleLogicForQuestionBlocks();
    }
  }

  toggleLogicForResultBlocks(): void {
    if (this.formBlock.extra_info === null || this.formBlock.extra_info === undefined) {
      this.formBlock.extra_info = '';
    } else {
      this.formBlock.extra_info = null;
    }
  }

  toggleLogicForQuestionBlocks(): void {
    if (this.formBlock.blockLogicRows) {
      this.formBlock.blockLogicRows = null;
    } else {
      this.formBlock.blockLogicRows = [FormsHelperService.generateNewBlockLogicRow(this.formBlock)];
    }
  }
}
