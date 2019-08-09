import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromRoot from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { OrientationService } from '../orientation.services';
import { OrientationUtilsService } from './../orientation.utils.service';

@Component({
  selector: 'cp-orientation-info',
  templateUrl: './orientation-info.component.html',
  styleUrls: ['./orientation-info.component.scss']
})
export class OrientationInfoComponent extends BaseComponent implements OnInit {
  loading;
  selectedProgram;
  orientationId: number;
  launchEditModal = false;

  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
    public service: OrientationService,
    private store: Store<fromRoot.IHeader>,
    private utils: OrientationUtilsService
  ) {
    super();
    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  public fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    super.fetchData(this.service.getProgramById(this.orientationId, search)).then((res) => {
      this.selectedProgram = res.data;
      this.updateHeader();
    });
  }

  onLaunchEditModal() {
    this.launchEditModal = true;
    setTimeout(
      () => {
        $('#programEdit').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onEditedLink(editedProgram: any) {
    this.launchEditModal = false;
    this.selectedProgram = editedProgram;
  }

  updateHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: this.utils.buildHeader(this.selectedProgram)
    });
  }

  ngOnInit() {
    this.fetch();
  }
}
