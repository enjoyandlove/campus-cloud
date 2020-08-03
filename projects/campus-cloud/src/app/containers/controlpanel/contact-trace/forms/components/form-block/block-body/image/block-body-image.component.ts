import { Component, Input, OnInit } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-block-body-image',
  templateUrl: './block-body-image.component.html',
  styleUrls: ['./block-body-image.component.scss']
})
export class BlockBodyImageComponent implements OnInit {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  formsHelper = FormsHelperService;

  constructor() {}

  ngOnInit(): void {}
}
