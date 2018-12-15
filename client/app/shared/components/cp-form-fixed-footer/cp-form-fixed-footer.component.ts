import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cp-form-fixed-footer',
  templateUrl: './cp-form-fixed-footer.component.html',
  styleUrls: ['./cp-form-fixed-footer.component.scss']
})
export class CPFormFixedFooterComponent {
  @Input() submitButtonText = 'save';
  @Input() submitButtonDisabled = false;

  @Output() submitClick: EventEmitter<null> = new EventEmitter();
  @Output() cancelClick: EventEmitter<null> = new EventEmitter();

  buttonData;

  onCancel() {
    this.cancelClick.emit();
  }
}
