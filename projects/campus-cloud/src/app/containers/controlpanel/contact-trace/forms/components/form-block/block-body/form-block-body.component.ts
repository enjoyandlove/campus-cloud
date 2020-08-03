import { Component, Input, OnInit } from '@angular/core';
import { BlockType, FormBlock } from '../../../models';

@Component({
  selector: 'cp-form-block-body',
  templateUrl: './form-block-body.component.html',
  styleUrls: ['./form-block-body.component.scss']
})
export class FormBlockBodyComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() indexPos: number;
  @Input() highlightFormError: boolean;
  blockType = BlockType;

  constructor() {}

  ngOnInit(): void {}
}
