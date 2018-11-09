import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IPersona } from './../persona.interface';
import { CPSession } from './../../../../../session';
import { PersonasService } from './../personas.service';
import { CPTrackingService } from '../../../../../shared/services';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { credentialType, PersonasType, PersonaValidationErrors } from '../personas.status';

@Component({
  selector: 'cp-personas-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class PersonasDeleteComponent implements OnInit {
  @Input() persona: IPersona;

  @Output() deleted: EventEmitter<null> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() errorEvent: EventEmitter<any> = new EventEmitter();

  buttonData;
  personaName;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: PersonasService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const search = new HttpParams()
      .append('force', 'true')
      .append('school_id', this.session.g.get('school').id);

    this.service.deletePersonaById(this.persona.id, search).subscribe(
      () => {
        this.resetModal();
        this.deleted.emit();
        this.trackDeleteExperienceEvent();
      },
      (err) => {
        const error = err.error.response;

        let message = this.cpI18n.translate('something_went_wrong');

        if (error === PersonaValidationErrors.last_persona) {
          message = this.cpI18n.translate('t_personas_delete_error_last_persona');
        } else if (error === PersonaValidationErrors.users_associated) {
          message = this.cpI18n.translate('t_personas_delete_error_users_associated');
        } else if (error === PersonaValidationErrors.persona_non_empty) {
          message = this.cpI18n.translate('t_personas_delete_error_persona_non_empty');
        }

        this.resetModal();
        this.errorEvent.emit(message);
      }
    );
  }

  resetModal() {
    $('#personaDeleteModal').modal('hide');

    this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

    this.teardown.emit();
  }

  trackDeleteExperienceEvent() {
    const experience_type = this.persona.platform === PersonasType.web
      ? amplitudeEvents.WEB
      : amplitudeEvents.MOBILE;

    const eventProperties = {
      experience_type,
      experience_id: this.persona.id,
      credential_type: credentialType[this.persona.login_requirement]
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.STUDIO_DELETED_EXPERIENCE,
      eventProperties
    );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };

    this.personaName = CPI18nService.getLocale().startsWith('fr')
      ? this.persona.localized_name_map.fr
      : this.persona.localized_name_map.en;
  }
}
