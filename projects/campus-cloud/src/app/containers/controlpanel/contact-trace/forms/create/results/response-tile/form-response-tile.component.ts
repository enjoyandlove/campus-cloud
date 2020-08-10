import { Component, Input, OnInit } from '@angular/core';
import { FormBlock, FormResponse } from '@controlpanel/contact-trace/forms/models';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-form-response-tile',
  templateUrl: './form-response-tile.component.html',
  styleUrls: ['./form-response-tile.component.scss']
})
export class FormResponseTileComponent implements OnInit {
  @Input() response: FormResponse;
  @Input() blockIdToBlockMap: { [key: string]: FormBlock } = {};
  @Input() filterQuestionBlockId: number;
  responseLabel = '';
  dateFormat = FORMAT.DATETIME;

  constructor() {}

  ngOnInit(): void {
    this.initializeResponseLabel(this.response);
  }

  private initializeResponseLabel(response: FormResponse) {
    if (response) {
      if (this.filterQuestionBlockId) {
        const userResponseStrings: string[] = FormsHelperService.generateRespondentResponsesForQuestion(
          response,
          this.blockIdToBlockMap[this.filterQuestionBlockId]
        );
        this.responseLabel = userResponseStrings.join(', ');
      } else {
        if (
          this.blockIdToBlockMap &&
          response.terminal_form_block_id &&
          this.blockIdToBlockMap[response.terminal_form_block_id]
        ) {
          this.responseLabel = this.blockIdToBlockMap[response.terminal_form_block_id].name;
        }
      }
    }
  }
}
