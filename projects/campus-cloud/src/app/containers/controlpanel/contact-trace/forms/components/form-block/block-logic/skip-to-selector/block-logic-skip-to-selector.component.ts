import { Component, Input, OnInit } from '@angular/core';
import { BlockLogicRowItem, BlockType, Form } from '../../../../models';

@Component({
  selector: 'cp-block-logic-skip-to-selector',
  templateUrl: './block-logic-skip-to-selector.component.html',
  styleUrls: ['./block-logic-skip-to-selector.component.scss']
})
export class BlockLogicSkipToSelectorComponent implements OnInit {
  @Input() form: Form;
  @Input() highlightFormError: boolean;
  @Input() blockLogicRow: BlockLogicRowItem;
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

  blockLogicSelectHandler(index: number): void {
    this.blockLogicRow.nextBlockIndex = index;
  }
}
