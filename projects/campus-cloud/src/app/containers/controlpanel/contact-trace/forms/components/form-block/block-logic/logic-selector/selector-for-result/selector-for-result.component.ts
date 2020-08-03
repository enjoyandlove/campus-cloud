import { Component, Input, OnInit } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';

@Component({
  selector: 'cp-selector-for-result',
  templateUrl: './selector-for-result.component.html',
  styleUrls: ['./selector-for-result.component.scss']
})
export class SelectorForResultComponent implements OnInit {
  @Input() formBlock: FormBlock;

  constructor() {}

  ngOnInit(): void {}

  formLogicClickHandler(val: string): void {
    if (this.formBlock.extra_info === val) {
      this.formBlock.extra_info = '';
    } else {
      this.formBlock.extra_info = val;
    }
  }
}
