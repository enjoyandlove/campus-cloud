import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-deals-card',
  templateUrl: './deals-card.component.html',
  styleUrls: ['./deals-card.component.scss']
})

export class DealsCardComponent {
  @Input() form: FormGroup;
  @Input() storeForm: FormGroup;

  @Output() formData: EventEmitter<{
    deal: any;
    dealFormValid: boolean
    store: any;
    storeFormValid: boolean
  }> = new EventEmitter();

}
