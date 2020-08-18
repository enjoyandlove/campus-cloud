import { Component, Input } from '@angular/core';
import { FormBlock } from '@controlpanel/contact-trace/forms/models';
import { FormsHelperService } from '@controlpanel/contact-trace/forms/services/forms-helper.service';

@Component({
  selector: 'cp-block-body-welcome',
  templateUrl: './block-body-welcome.component.html',
  styleUrls: ['./block-body-welcome.component.scss']
})
export class BlockBodyWelcomeComponent {
  @Input() formBlock: FormBlock;
  @Input() highlightFormError: boolean;
  formsHelper = FormsHelperService;

  constructor() {}
}
