import { Component, Input, OnInit } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-block-body-text',
  templateUrl: './block-body-text.component.html',
  styleUrls: ['./block-body-text.component.scss']
})
export class BlockBodyTextComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  formsHelper = FormsHelperService;

  constructor() {}

  ngOnInit(): void {}
}
