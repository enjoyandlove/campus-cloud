import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CPI18nService } from '@campus-cloud/shared/services';
import { IItem } from '@controlpanel/manage/calendars/items/item.interface';
import { IPersona } from '@controlpanel/customise/personas/persona.interface';
import { PersonasType, PersonasLoginRequired } from '../../../personas.status';

@Component({
  selector: 'cp-persona-delete',
  templateUrl: './persona-delete.component.html',
  styleUrls: ['./persona-delete.component.scss']
})
export class PersonaDeleteComponent implements OnInit {
  @Input() persona: IPersona;
  @Input() personas: IItem[];

  @Output() cancelClick: EventEmitter<null> = new EventEmitter();
  @Output() deleteClick: EventEmitter<null> = new EventEmitter();

  buttonData;
  canDelete: boolean;
  personaName: string;
  substitutePersonaId = null;

  constructor(private cpI18n: CPI18nService) {}

  onSelectPersona(selectedPersona) {
    this.substitutePersonaId = selectedPersona.action;

    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.substitutePersonaId =
      this.persona.platform === PersonasType.web ? null : this.personas[0]['action'];

    this.canDelete =
      this.persona.platform === PersonasType.web ||
      this.persona.login_requirement === PersonasLoginRequired.forbidden;

    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };

    this.personaName = CPI18nService.getLocalizedLabel(this.persona.localized_name_map);
  }
}
