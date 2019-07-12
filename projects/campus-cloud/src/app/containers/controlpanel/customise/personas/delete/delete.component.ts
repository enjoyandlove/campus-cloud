import { Component, Inject, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';

import { IPersona } from './../persona.interface';
import { CPSession } from '@campus-cloud/session';
import { PersonasService } from './../personas.service';
import { IItem } from '@campus-cloud/shared/components';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { PersonasUtilsService } from '../../personas/personas.utils.service';
import {
  credentialType,
  PersonasType,
  PersonaValidationErrors,
  PersonasLoginRequired
} from '../personas.status';

import {
  IModal,
  MODAL_DATA,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-personas-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class PersonasDeleteComponent implements OnInit {
  loading = true;
  personas: IItem[];
  persona: IPersona;
  canDelete: boolean;

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: PersonasService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete(substitutePersonaId = null) {
    let search = new HttpParams()
      .set('force', 'true')
      .set('school_id', this.session.g.get('school').id);

    if (substitutePersonaId) {
      search = search.set('substitute_persona_id', String(substitutePersonaId));
    }

    this.service.deletePersonaById(this.persona.id, search).subscribe(
      () => {
        this.modal.onAction();
        this.modal.onClose();
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

        this.modal.onAction(message);
        this.modal.onClose();
      }
    );
  }

  fetchPersonas() {
    let search = new HttpParams()
      .set('platform', String(PersonasType.mobile))
      .set('school_id', this.session.g.get('school').id);

    this.service
      .getPersonas(1, 10000, search)
      .pipe(
        map((persona: IPersona[]) =>
          persona.filter(
            (p) =>
              p.login_requirement !== PersonasLoginRequired.forbidden && p.id !== this.persona.id
          )
        ),
        map((persona: IPersona[]) => {
          this.loading = false;
          this.personas = PersonasUtilsService.setPersonaDropDown(persona);
        }),
        startWith([{ label: '---', action: null }])
      )
      .subscribe();
  }

  trackDeleteExperienceEvent() {
    const experience_type =
      this.persona.platform === PersonasType.web ? amplitudeEvents.WEB : amplitudeEvents.MOBILE;

    const eventProperties = {
      experience_type,
      experience_id: this.persona.id,
      credential_type: credentialType[this.persona.login_requirement]
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.STUDIO_DELETED_EXPERIENCE, eventProperties);
  }

  resetModal() {
    this.modal.onClose();
  }

  ngOnInit() {
    this.persona = this.modal.data;
    this.fetchPersonas();
  }
}
