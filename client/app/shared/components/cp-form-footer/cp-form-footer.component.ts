import { Component, EventEmitter, Input, Output } from '@angular/core';

interface IProps {
  text: string;
  class: string;
  disabled?: boolean;
  trackingData?: {
    eventCategory: string;
    eventAction: string;
  };
}

@Component({
  selector: 'cp-form-footer',
  templateUrl: './cp-form-footer.component.html',
  styleUrls: ['./cp-form-footer.component.scss']
})
export class CPFormFooterComponent {
  @Input() formErrors: boolean;
  @Input() cancelLink = '../';
  @Input() buttonData: IProps;
  @Input() errorMessage: string;

  @Output() doSubmit: EventEmitter<null> = new EventEmitter();
}
