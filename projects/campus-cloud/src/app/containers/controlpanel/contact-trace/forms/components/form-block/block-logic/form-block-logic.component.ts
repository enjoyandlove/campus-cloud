import { Component, Input, OnInit } from '@angular/core';
import { BlockType, Form, FormBlock } from '../../../models';

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
}
