import { Component, Input, OnInit } from '@angular/core';
import { BlockLogic, FormBlock, LogicOperator } from '@controlpanel/contact-trace/forms/models';

@Component({
  selector: 'cp-selector-for-options',
  templateUrl: './selector-for-options.component.html',
  styleUrls: ['./selector-for-options.component.scss']
})
export class SelectorForOptionsComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;

  constructor() {}

  ngOnInit(): void {}

  blockContentClickHandler(index: number): void {
    const skipToSelection: number = this.formBlock.block_logic_list[0].next_block_index;
    const match: BlockLogic = this.formBlock.block_logic_list.find(
      (blockLogic) => blockLogic.block_content_index === index
    );
    if (match) {
      this.formBlock.block_logic_list = this.formBlock.block_logic_list.filter(
        (blockLogic) => blockLogic.block_content_index !== index
      );
    } else {
      this.formBlock.block_logic_list.push({
        block_content_index: index,
        next_block_index: skipToSelection,
        logic_op: LogicOperator.equal
      });
    }
    if (this.formBlock.block_logic_list.length > 1) {
      this.formBlock.block_logic_list = this.formBlock.block_logic_list.filter(
        (blockLogic) =>
          blockLogic.block_content_index !== null && blockLogic.block_content_index !== undefined
      );
    } else if (this.formBlock.block_logic_list.length === 0) {
      this.formBlock.block_logic_list.push({
        next_block_index: skipToSelection
      });
    }
  }

  isIndexSelected(index: number): boolean {
    const match: BlockLogic = this.formBlock.block_logic_list.find(
      (blockLogic) => blockLogic.block_content_index === index
    );
    return !!match;
  }

  getAlphabetForNumber(num: number): string {
    return String.fromCharCode(num + 96);
  }

  highlightError(): boolean {
    return (
      this.highlightFormError &&
      (this.formBlock.block_logic_list[0].block_content_index === null ||
        this.formBlock.block_logic_list[0].block_content_index === undefined)
    );
  }
}
