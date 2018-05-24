import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { pullAt } from 'lodash';

import { IPersona } from './../persona.interface';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasService } from './../personas.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';
import { ISnackbar, SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';

@Component({
  selector: 'cp-personas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PersonasListComponent extends BaseComponent implements OnInit {
  loading;
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

    const search = new URLSearchParams();
    search.append('school_id', schoolId);

    delete persona['id'];
    persona['school_id'] = schoolId;

    // a rank of zero is not allowed
    console.log(1, persona);
    persona = { ...persona, rank: persona.rank + 1 };
    console.log(2, persona);

    return this.service.updatePersona(personaId, search, persona).toPromise();
  }

  handleUpdateError() {
    this.state = { ...this.state, updating: false };

    this.store.dispatch({
      type: SNACKBAR_SHOW,
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
    const firstItemInList = currentIndex === 0;
    const newIndex = firstItemInList ? this.state.personas.length - 1 : currentIndex - 1;

    const movingPersona = {
      ...this.state.personas[currentIndex],
      rank: newIndex
    };

    const movedPersona = {
      ...this.state.personas[currentIndex - 1],
      rank: newIndex - 1
    };

    this.state = { ...this.state, updating: true };

    const updatePersonas = Promise.all([
      this.updatePersona(movingPersona),
      this.updatePersona(movedPersona)
    ]);

    updatePersonas
      .then(() => {
        this.state = { ...this.state, updating: false };

        const personas = this.movePersonaToIndex(persona, currentIndex, newIndex);

        this.state = {
          ...this.state,
          personas
        };
      })
      .catch(() => this.handleUpdateError());
  }

  onRankDown(persona: IPersona, currentIndex: number) {
    const lastItemInList = currentIndex === this.state.personas.length - 1;
    const newIndex = lastItemInList ? 0 : currentIndex + 1;

    const movingPersona = {
      ...this.state.personas[currentIndex],
      rank: newIndex
    };

    const movedPersona = {
      ...this.state.personas[lastItemInList ? 0 : currentIndex + 1],
      rank: newIndex + 1
    };

    this.state = { ...this.state, updating: true };

    const updatePersonas = Promise.all([
      this.updatePersona(movingPersona),
      this.updatePersona(movedPersona)
    ]);

    updatePersonas
      .then(() => {
        this.state = { ...this.state, updating: false };

        const personas = this.movePersonaToIndex(persona, currentIndex, newIndex);

        this.state = {
          ...this.state,
          personas
        };
      })
      .catch(() => this.handleUpdateError());
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    if (this.state.search_str) {
      search.append('search_str', this.state.search_str);
    }

    if (this.state.platform) {
      search.append('platform', this.state.platform);
    }

    const stream$ = this.service.getPersonas(this.startRange, this.endRange, search);

    super.fetchData(stream$).then(({ data }) => (this.state = { ...this.state, personas: data }));
  }

  updateHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../customise.header.json')
    });
  }

  ngOnInit(): void {
    this.updateHeader();
    this.fetch();
  }
}
