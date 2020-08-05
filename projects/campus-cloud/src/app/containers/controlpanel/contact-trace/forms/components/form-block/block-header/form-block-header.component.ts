import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockType, FormBlock, LogicOperator, OperandType } from '../../../models';

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
    if (this.formBlock.block_logic_list && this.formBlock.block_logic_list.length > 0) {
      delete this.formBlock.block_logic_list;
    } else {
      let dataType: OperandType;
      if (this.formBlock.block_type === BlockType.text) {
        dataType = OperandType.str;
      } else if (this.formBlock.block_type === BlockType.number) {
        dataType = OperandType.int;
      } else if (this.formBlock.block_type === BlockType.decimal) {
        dataType = OperandType.decimal;
      }
      this.formBlock.block_logic_list = [
        {
          next_block_index: -1,
          logic_op: LogicOperator.equal,
          arbitrary_data_type: dataType
        }
      ];
    }
  }
}
