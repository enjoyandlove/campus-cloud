import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { pullAt } from 'lodash';

import { IPersona } from './../persona.interface';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasService } from './../personas.service';
import { PersonaValidationErrors } from './../personas.status';
import { CPTrackingService } from '../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { baseActions, IHeader, ISnackbar } from './../../../../../store/base';

@Component({
  selector: 'cp-personas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PersonasListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  state = {
    updating: false,
    platform: null,
    search_str: null,
    personas: <Array<IPersona>>[]
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: PersonasService,
    public cpTracking: CPTrackingService,
    public store: Store<IHeader | ISnackbar>
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onFilterByPersonaType(platform) {
    this.state = { ...this.state, platform };

    this.resetPagination();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = { ...this.state, search_str };

    this.resetPagination();

    this.fetch();
  }

  updatePersona(persona: IPersona): Promise<any> {
    const personaId = persona.id;
    const schoolId = this.session.g.get('school').id;

    const search = new HttpParams().append('school_id', schoolId);

    delete persona['id'];
    persona['school_id'] = schoolId;

    return this.service.updatePersona(personaId, search, persona).toPromise();
  }

  handleUpdateError() {
    this.state = { ...this.state, updating: false };

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        autoClose: true,
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  movePersonaToIndex(persona, currentIndex, newIndex) {
    // avoid mutating the original personas
    const clonedPersonas = [...this.state.personas];

    // remove persona from current index
    pullAt(clonedPersonas, currentIndex);

    // insert persona into new index
    clonedPersonas.splice(newIndex, 0, persona);

    return clonedPersonas;
  }

  onRankUp(persona: IPersona, currentIndex: number) {
    this.state = { ...this.state, updating: true };

    const movingPersona = {
      ...persona,
      rank: this.state.personas[currentIndex - 1].rank
    };

    const movedPersona = {
      ...this.state.personas[currentIndex - 1],
      rank: persona.rank
    };

    const updatePersonas = Promise.all([
      this.updatePersona(movingPersona),
      this.updatePersona(movedPersona)
    ]);

    updatePersonas
      .then(() => {
        this.state = { ...this.state, updating: false };

        const personas = this.movePersonaToIndex(persona, currentIndex, currentIndex - 1);

        this.state = {
          ...this.state,
          personas
        };
      })
      .catch(() => this.handleUpdateError());
  }

  onRankDown(persona: IPersona, currentIndex: number) {
    this.state = { ...this.state, updating: true };

    const movingPersona = {
      ...persona,
      rank: this.state.personas[currentIndex + 1].rank
    };

    const movedPersona = {
      ...this.state.personas[currentIndex + 1],
      rank: persona.rank
    };

    const updatePersonas = Promise.all([
      this.updatePersona(movingPersona),
      this.updatePersona(movedPersona)
    ]);

    updatePersonas
      .then(() => {
        this.state = { ...this.state, updating: false };

        const personas = this.movePersonaToIndex(persona, currentIndex, currentIndex + 1);

        this.state = {
          ...this.state,
          personas
        };
      })
      .catch(() => this.handleUpdateError());
  }

  fetch() {
    let search = new HttpParams().append('school_id', this.session.g.get('school').id);

    if (this.state.platform !== null) {
      search = search.append('platform', this.state.platform);
    }

    let stream$ = this.service.getPersonas(this.startRange, this.endRange, search);

    if (this.state.search_str) {
      const matchesEnglish = (p: IPersona) =>
        p.localized_name_map.en
          .toLocaleLowerCase()
          .includes(this.state.search_str.toLocaleLowerCase());

      const matchesFrench = (p: IPersona) =>
        p.localized_name_map.fr
          .toLocaleLowerCase()
          .includes(this.state.search_str.toLocaleLowerCase());

      stream$ = stream$.pipe(
        map((personas: any) =>
          personas.filter((p: IPersona) => matchesEnglish(p) || matchesFrench(p))
        )
      );
    }

    super
      .fetchData(stream$)
      .then(({ data }) => (this.state = { ...this.state, personas: data }))
      .catch((err) => this.errorHandler(err));
  }

  errorHandler(err: HttpErrorResponse) {
    this.loading = false;
    let snackBarClass = 'danger';

    const error = err.error.response;

    let message = this.cpI18n.translate('something_went_wrong');

    if (error === PersonaValidationErrors.customization_off) {
      snackBarClass = 'warning';
      message = this.cpI18n.translate('t_personas_edit_error_customization_off');
    }

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: snackBarClass,
        body: message
      }
    });
  }

  updateHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../customise.header.json')
    });
  }

  ngOnInit(): void {
    this.updateHeader();
    this.fetch();

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };
  }
}
