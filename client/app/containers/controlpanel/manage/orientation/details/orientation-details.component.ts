import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { OrientationService } from '../orientation.services';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-orientation-details',
  template: '<router-outlet></router-outlet>',
})
export class OrientationDetailsComponent extends BaseComponent implements OnInit {

  @Input() isOrientation = false;

  labels;
  loading;
  orientationId: number;

  constructor(private store: Store<any>,
              private session: CPSession,
              private route: ActivatedRoute,
              private service: OrientationService) {
    super();

    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getOrientationProgramById(this.orientationId, search))
      .then((program) => {
        this.store.dispatch({
          type: HEADER_UPDATE,
          payload: this.buildHeader(program.data[0].name),
        });
      });
  }

  buildHeader(name) {
    const menu = {
      heading: `[NOTRANSLATE]${name}[NOTRANSLATE]`,
      crumbs: {
        url: 'orientation',
        label: 'orientation',
      },
      subheading: null,
      em: null,
      children: [],
    };

    // todo create utility service to filter menu with privileges (if any)
    const links = ['Events', 'To-Dos', 'Feeds', 'Members', 'Info'];

    links.forEach((link) => {
      menu.children.push({
        label: link.toLocaleLowerCase(),
        url: `/manage/orientation/${this.orientationId}/${link.toLocaleLowerCase()}`,
      });
    });

    return menu;
  }

  ngOnInit() {
      this.fetch();
  }
}
