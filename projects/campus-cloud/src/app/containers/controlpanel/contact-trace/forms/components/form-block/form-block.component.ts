import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockType, Form, FormBlock } from '../../models';

@Component({
  selector: 'cp-form-block',
  templateUrl: './form-block.component.html',
  styleUrls: ['./form-block.component.scss']
})
export class FormBlockComponent implements OnInit {
  @Input() form: Form;
  @Input() formBlock: FormBlock;
  @Input() indexPos: number;
  @Input() highlightFormError: boolean;
  @Output() deleteClicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  deleteClickHandler(): void {
    this.deleteClicked.emit();
  }

  blockTypeSelectionHandler(blockType: BlockType): void {
    this.formBlock.block_type = blockType;
    switch (blockType) {
      case BlockType.text:
      case BlockType.number:
      case BlockType.decimal:
      case BlockType.image:
        this.formBlock.block_content_list = [
          {
            text: '',
            rank: 0
          }
        ];
        break;
      case BlockType.multiple_choice:
        this.formBlock.block_content_list = [
          {
            text: '',
            rank: 0
          },
          {
            text: '',
            rank: 1
          }
        ];
        break;
      case BlockType.multiple_selection:
        this.formBlock.block_content_list = [
          {
            text: '',
            rank: 0
          },
          {
            text: '',
            rank: 1
          }
        ];
        break;
      case BlockType.yes_no:
        this.formBlock.block_type = BlockType.multiple_choice;
        this.formBlock.block_content_list = [
          {
            text: 'Yes',
            rank: 0
          },
          {
            text: 'No',
            rank: 1
          }
        ];
        break;
    }
  }
}
