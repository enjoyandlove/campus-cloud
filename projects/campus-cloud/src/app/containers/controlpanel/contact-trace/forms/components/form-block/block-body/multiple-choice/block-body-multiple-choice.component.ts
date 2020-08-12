import { Component, Input, OnInit } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-block-body-multiple-choice',
  templateUrl: './block-body-multiple-choice.component.html',
  styleUrls: ['./block-body-multiple-choice.component.scss']
})
export class BlockBodyMultipleChoiceComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  formsHelper = FormsHelperService;
  MAX_ANSWER_OPTIONS_LIMIT = 15;

  constructor() {}

  ngOnInit(): void {}

  getAlphabetForNumber(num: number): string {
    return String.fromCharCode(num + 96);
  }

  addBlockContentClickHandler(): void {
    if (this.formBlock.block_content_list.length < this.MAX_ANSWER_OPTIONS_LIMIT) {
      this.formBlock.block_content_list.push({
        text: '',
        rank: this.formBlock.block_content_list.length
      });
      FormsHelperService.addContentIndexToBlockLogicRows(this.formBlock.blockLogicRows);
    }
  }

  deleteContentClickHandler(index: number): void {
    this.formBlock.block_content_list.splice(index, 1);
    FormsHelperService.removeContentIndexFromBlockLogicRows(this.formBlock.blockLogicRows, index);
  }
}
