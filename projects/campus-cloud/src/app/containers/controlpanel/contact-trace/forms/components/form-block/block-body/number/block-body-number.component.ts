import { Component, Input, OnInit } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-block-body-number',
  templateUrl: './block-body-number.component.html',
  styleUrls: ['./block-body-number.component.scss']
})
export class BlockBodyNumberComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  formsHelper = FormsHelperService;

  constructor() {}

  ngOnInit(): void {}
}
