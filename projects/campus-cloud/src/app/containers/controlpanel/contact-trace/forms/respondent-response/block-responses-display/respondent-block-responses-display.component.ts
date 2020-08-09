import { Component, Input, OnInit } from '@angular/core';
import { FormBlock, FormResponse } from '../../../forms';
import { FormsHelperService } from '../../services';

@Component({
  selector: 'cp-respondent-question-response',
  templateUrl: './respondent-block-responses-display.component.html',
  styleUrls: ['./respondent-block-responses-display.component.scss']
})
export class RespondentBlockResponsesDisplayComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() response: FormResponse;
  userResponseStrings: string[];

  constructor() {}

  ngOnInit(): void {
    this.initializeResponseStrings();
  }

  private initializeResponseStrings(): void {
    if (this.formBlock.is_terminal) {
      // Result Block
      this.userResponseStrings = [this.formBlock.name];
    } else {
      // Question Block
      this.userResponseStrings = FormsHelperService.generateRespondentResponsesForQuestion(
        this.response,
        this.formBlock
      );
    }
  }
}
