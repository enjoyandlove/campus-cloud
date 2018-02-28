import { ActivatedRoute } from '@angular/router'; // Router
import { Component, Input, OnInit } from '@angular/core';
// import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

// import { OrientationService } from '../orientation.services';
// import { CPSession } from '../../../../../session';
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

  constructor(
  //  private router: Router,
    private store: Store<any>,
  //  private session: CPSession,
    private route: ActivatedRoute,
  //  private service: OrientationService,
  ) {
    super();

    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

 /* private fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getClubById(this.clubId, search))
      .then((club) => {
        this.club = club.data;

        if (!this.router.url.split('/').includes('facebook')) {
          this.store.dispatch({
            type: HEADER_UPDATE,
            payload: this.buildHeader(club.data.name),
          });
        }
      });
  }*/

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

    const links = ['Events', 'To-Dos', 'Feeds', 'Member', 'Info'];

    links.forEach((link) => {
      menu.children.push({
        label: link.toLocaleLowerCase(),
        url: `/manage/orientation/${this.orientationId}/${link.toLocaleLowerCase()}`,
      });
    });

    return menu;
  }

  ngOnInit() {
      this.store.dispatch({
        type: HEADER_UPDATE,
        payload: this.buildHeader('hello'),
      });
    // this.fetch();
  }
}
