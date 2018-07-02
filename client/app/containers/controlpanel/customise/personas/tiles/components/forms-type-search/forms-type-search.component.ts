import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CPSession } from './../../../../../../../session/index';
import { StoreService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-forms-type-search',
  templateUrl: './forms-type-search.component.html',
  styleUrls: ['./forms-type-search.component.scss']
})
export class PersonasTileFormTypeSearchComponent implements OnInit {
  items$;

  constructor(public storeService: StoreService, public session: CPSession) {}

  onSelected(selection) {
    console.log(selection);
  }

  ngOnInit(): void {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.storeService.getStores(headers);
  }
}
