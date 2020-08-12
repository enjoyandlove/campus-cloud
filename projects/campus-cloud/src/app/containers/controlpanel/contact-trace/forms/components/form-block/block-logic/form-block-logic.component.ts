import { Component, Input, OnInit } from '@angular/core';
import { BlockType, Form, FormBlock } from '../../../models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms';

@Component({
  selector: 'cp-form-block-logic',
  templateUrl: './form-block-logic.component.html',
  styleUrls: ['./form-block-logic.component.scss']
})
export class FormBlockLogicComponent implements OnInit {
  @Input() form: Form;
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  blockType = BlockType;

  constructor() {}

  ngOnInit(): void {}

  deleteBlockLogicRowClickHandler(index: number): void {
    this.formBlock.blockLogicRows.splice(index, 1);
    if (this.formBlock.blockLogicRows.length === 0) {
      this.formBlock.blockLogicRows = null;
    }
  }

  addBlockLogicRowClickHandler(): void {
    this.formBlock.blockLogicRows.push(FormsHelperService.generateNewBlockLogicRow(this.formBlock));
  }
}
