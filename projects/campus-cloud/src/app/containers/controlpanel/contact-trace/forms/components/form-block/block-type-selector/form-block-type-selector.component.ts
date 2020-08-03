import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlockType } from '../../../models';

@Component({
  selector: 'cp-form-block-type-selector',
  templateUrl: './form-block-type-selector.component.html',
  styleUrls: ['./form-block-type-selector.component.scss']
})
export class FormBlockTypeSelectorComponent implements OnInit {
  @Output() blockTypeSelected = new EventEmitter<BlockType>();
  @Input() highlightFormError: boolean;
  blockType = BlockType;

  constructor() {}

  ngOnInit(): void {}

  selectBlockType(blockType: BlockType): void {
    this.blockTypeSelected.emit(blockType);
  }
}
