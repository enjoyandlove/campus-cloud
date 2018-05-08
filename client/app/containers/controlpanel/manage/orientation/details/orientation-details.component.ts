import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { OrientationService } from '../orientation.services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { OrientationUtilsService } from '../orientation.utils.service';

@Component({
  selector: 'cp-orientation-details',
  template: '<router-outlet></router-outlet>'
})
export class OrientationDetailsComponent extends BaseComponent implements OnInit {
  loading;
  orientationId: number;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private service: OrientationService,
    private utils: OrientationUtilsService
  ) {
    super();

    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  private fetch() {
    const search = new HttpParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super.fetchData(this.service.getProgramById(this.orientationId, search)).then((program) => {
      this.store.dispatch({
        type: HEADER_UPDATE,
        payload: this.utils.buildHeader(program.data)
      });
    });
  }

  ngOnInit() {
    this.fetch();
  }
}
