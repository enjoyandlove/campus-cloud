import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { IPersona } from './../persona.interface';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { PersonasService } from './../personas.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { HEADER_UPDATE, IHeader } from './../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-personas-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class PersonasListComponent extends BaseComponent implements OnInit {
  loading;
  state = {
    platform: null,
    search_str: null,
    personas: <Array<IPersona>>[]
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: PersonasService
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
