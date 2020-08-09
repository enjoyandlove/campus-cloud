import { Component, Input, OnInit } from '@angular/core';
import {
  BlockContent,
  CollectionMethod,
  FormBlock,
  FormResponse
} from '@controlpanel/contact-trace/forms/models';
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
  collectionMethod = '';
  responseLabel = '';
  collectionMethodToDisplayStringMap: { [key: number]: string } = {
    [CollectionMethod.app]: 'contact_trace_forms_app',
    [CollectionMethod.web]: 'contact_trace_forms_web'
  };
  dateFormat = FORMAT.DATETIME;

  constructor() {}

  ngOnInit(): void {
    this.initializeCollectionMethodDisplayString(this.response);
    this.initializeResponseLabel(this.response);
  }

  private initializeCollectionMethodDisplayString(response: FormResponse) {
    if (
      response &&
      response.collection_method &&
      this.collectionMethodToDisplayStringMap[response.collection_method]
    ) {
      this.collectionMethod = this.collectionMethodToDisplayStringMap[response.collection_method];
    }
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
