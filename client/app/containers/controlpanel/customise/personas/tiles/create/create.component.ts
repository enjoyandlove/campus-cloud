import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-personas-tile-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class PersonasTileCreateComponent implements OnInit {
  buttonData;
  contentTypes = require('./content-types.json');
  resources = require('./resources.json');

  constructor(public cpI18n: CPI18nService) {}

  onSubmit() {
    // console.log('YOOO');
  }

  onContentTypeChange() {
    // console.log('selected ', {id});
  }

  ngOnInit(): void {
    this.buttonData = {
      class: 'primary',
      disabled: true,
      text: this.cpI18n.translate('t_personas_create_submit_button')
    };
  }
}
