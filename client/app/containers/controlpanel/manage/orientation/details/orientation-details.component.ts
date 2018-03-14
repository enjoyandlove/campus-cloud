import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { OrientationService } from '../orientation.services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { OrientationUtilsService } from '../orientation.utils.service';

@Component({
  selector: 'cp-orientation-details',
  template: '<router-outlet></router-outlet>',
})
export class OrientationDetailsComponent extends BaseComponent implements OnInit {
  loading;
  orientationId: number;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private service: OrientationService,
    private utils: OrientationUtilsService) {
    super();

    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
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

    const subNav = this.utils.getSubNavChildren(program.is_membership);

    subNav.forEach((nav) => {
      menu.children.push({
        label: nav.label.toLocaleLowerCase(),
        url: `/manage/orientation/${this.orientationId}/${nav.link}`,
      });
    });

    return menu;
  }

  ngOnInit() {
      this.fetch();
  }
}
