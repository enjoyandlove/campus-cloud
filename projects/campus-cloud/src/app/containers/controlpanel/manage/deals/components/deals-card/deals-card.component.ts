import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDeal } from '../../deals.interface';
import { IStore } from '../../stores/store.interface';

@Component({
  selector: 'cp-deals-card',
  templateUrl: './deals-card.component.html',
  styleUrls: ['./deals-card.component.scss']
})
export class DealsCardComponent {
  @Input() form: FormGroup;
  @Input() storeForm: FormGroup;

  @Output()
  formData: EventEmitter<{
    deal: IDeal;
    dealFormValid: boolean;
    store: IStore;
    storeFormValid: boolean;
  }> = new EventEmitter();
}
