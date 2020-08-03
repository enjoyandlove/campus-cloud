import { Component, Input, OnInit } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-block-body-decimal',
  templateUrl: './block-body-decimal.component.html',
  styleUrls: ['./block-body-decimal.component.scss']
})
export class BlockBodyDecimalComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  formsHelper = FormsHelperService;

  constructor() {}

  ngOnInit(): void {}
}
