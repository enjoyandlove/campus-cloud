import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { baseActions } from '../../../../../store/base';
import { EventsService } from '../../events/events.service';
import { OrientationService } from '../orientation.services';
import { OrientationUtilsService } from '../orientation.utils.service';
import { OrientationEventsService } from './orientation.events.service';

@Component({
  selector: 'cp-orientation-events',
  template: `<cp-events
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events>`,
  providers: [{ provide: EventsService, useClass: OrientationEventsService }]
})
export class OrientationEventsComponent extends BaseComponent {
  isOrientation = true;
  orientationId: number;

  loading;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private service: OrientationService,
    private utils: OrientationUtilsService
  ) {
    super();

    this.orientationId = this.route.parent.snapshot.parent.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));

    this.fetch();
  }

  private fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    super.fetchData(this.service.getProgramById(this.orientationId, search)).then((program) => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: this.utils.buildHeader(program.data)
      });
    });
  }
}
