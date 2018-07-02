import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CPSession } from './../../../../../../../session/index';
import { StoreService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-forms-type-search',
  templateUrl: './forms-type-search.component.html',
  styleUrls: ['./forms-type-search.component.scss']
})
export class PersonasTileFormTypeSearchComponent implements OnInit {
  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;

  constructor(public storeService: StoreService, public session: CPSession) {}

  onSelected(id) {
    this.selected.emit({
      meta: {
        is_system: 1,
        link_params: {
          id
        },
        open_in_browser: 0,
        link_url: 'oohlala://store'
      }
    });
  }

  ngOnInit(): void {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.storeService.getStores(headers);
  }
}
