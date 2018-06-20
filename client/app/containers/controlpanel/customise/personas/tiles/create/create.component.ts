import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-personas-tile-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasTileCreateComponent implements OnInit {
  buttonData;

  constructor(public cpI18n: CPI18nService) {}

  onSubmit() {
    console.log('YOOO');
  }

  ngOnInit(): void {
    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('t_personas_create_submit_button')
    };
  }
}
