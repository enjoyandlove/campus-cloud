import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../../../../base';
import { CPSession } from '../../../../../session';
import { Store } from '@ngrx/store';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { URLSearchParams } from '@angular/http';
import { OrientationService } from '../orientation.services';
import { OrientationUtilsService } from '../orientation.utils.service';

@Component({
  selector: 'cp-orientation-events',
  template: `<cp-events
              [isOrientation]="isOrientation"
              [orientationId]="orientationId">
             </cp-events>`,
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
    private utils: OrientationUtilsService) {
    super();

    this.orientationId = this.route.parent.snapshot.parent.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));

    this.fetch();
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getProgramById(this.orientationId, search))
      .then((program) => {
        this.store.dispatch({
          type: HEADER_UPDATE,
          payload: this.buildHeader(program.data),
        });
      });
  }

  buildHeader(program) {
    const menu = {
      heading: `[NOTRANSLATE]${program.name}[NOTRANSLATE]`,
      crumbs: {
        url: 'orientation',
        label: 'orientation',
      },
      subheading: null,
      em: null,
      children: [],
    };

    const subNav = this.utils.getSubNavChildren(program.has_membership);

    subNav.forEach((nav) => {
      menu.children.push({
        label: nav.label.toLocaleLowerCase(),
        url: `/manage/orientation/${this.orientationId}/${nav.link}`,
      });
    });

    return menu;
  }
}
