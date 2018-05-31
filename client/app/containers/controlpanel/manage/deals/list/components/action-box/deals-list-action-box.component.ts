import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IDeal } from '../../../deals.interface';
import { DealsService } from '../../../deals.service';

export interface IState {
  deals: Array<IDeal>;
  store_id: number;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state = {
  deals: [],
  store_id: null,
  search_str: null,
  sort_field: 'title',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-deals-action-box',
  templateUrl: './deals-list-action-box.component.html',
  styleUrls: ['./deals-list-action-box.component.scss']
})
export class DealsListActionBoxComponent implements OnInit {
  stores$;
  state: IState = state;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() listAction: EventEmitter<any> = new EventEmitter();

  constructor(public dealsService: DealsService) {}

  onFilterByStore(store_id) {
    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  onSearch(query) {
    this.search.emit(query);
  }

  ngOnInit() {
    this.stores$ = this.dealsService.getStores();
  }
}
