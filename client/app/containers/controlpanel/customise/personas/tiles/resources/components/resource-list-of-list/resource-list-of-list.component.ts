import { SNACKBAR_SHOW } from './../../../../../../../../reducers/snackbar.reducer';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResourceService } from './../../resource.service';
import { CPSession } from '../../../../../../../../session';
import { TilesService } from '../../../tiles.service';
import { ISnackbar } from '../../../../../../../../reducers/snackbar.reducer';
import { Store } from '../../../../../../../../../../node_modules/@ngrx/store';
import { CPI18nService } from '../../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-resource-list-of-list',
  templateUrl: './resource-list-of-list.component.html',
  styleUrls: ['./resource-list-of-list.component.scss']
})
export class PersonasResourceListOfListComponent implements OnInit {
  @Input() selectedIds: Number[];

  @Output() resourceAdded: EventEmitter<any> = new EventEmitter();

  links$;
  meta = {
    is_system: 1,
    link_params: {
      ids: []
    },
    open_in_browser: 0,
    link_url: 'oohlala://campus_link_list'
  };

  state = {
    loading: false,
    resources: [],
    showModal: false
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public service: ResourceService,
    public tileService: TilesService
  ) {}

  onShowModal() {
    this.state = {
      ...this.state,
      showModal: true
    };

    setTimeout(
      () => {
        $('#resourceCreateModal').modal();
      },

      1
    );
  }

  errorHandler() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  onTearDown() {
    this.state = {
      ...this.state,
      showModal: false
    };

    $('#resourceCreateModal').modal('hide');
  }

  onCreatedResource(newResource) {
    this.state = {
      ...this.state,
      resources: [newResource, ...this.state.resources]
    };

    this.udpateMetaAndEmit();
  }

  udpateMetaAndEmit() {
    const ids = this.state.resources.map((r) => r.id);

    this.meta = {
      ...this.meta,
      link_params: ids.length ? { ids } : null
    };

    this.resourceAdded.emit({ meta: this.meta });
  }

  fetchLinks() {
    this.state = {
      ...this.state,
      loading: true
    };
    const campus_link_ids = this.selectedIds.map((n) => String(n)).join(',');

    const search = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('campus_link_ids', campus_link_ids);
    const stream$ = this.service.getCampusLink(search, 1, 9000);

    stream$.subscribe(
      (resources: any) => {
        this.state = {
          ...this.state,
          loading: false,
          resources: [...resources]
        };
      },
      () => this.errorHandler()
    );
  }

  onDelete(resource) {
    this.state = {
      ...this.state,
      resources: this.state.resources.filter((r) => r.id !== resource.id)
    };

    this.udpateMetaAndEmit();
  }

  ngOnInit(): void {
    if (this.selectedIds) {
      this.fetchLinks();
    }
  }
}
