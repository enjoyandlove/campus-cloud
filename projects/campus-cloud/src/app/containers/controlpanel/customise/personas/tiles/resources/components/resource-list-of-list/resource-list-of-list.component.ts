import {
  Input,
  OnInit,
  Output,
  Component,
  QueryList,
  ElementRef,
  EventEmitter,
  ViewChildren,
  AfterViewInit
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { parseErrorResponse } from '@campus-cloud/shared/utils';
import { TilesService } from '../../../tiles.service';
import { baseActions, ISnackbar } from '@campus-cloud/store/base';
import { IPersona } from './../../../../persona.interface';
import { ResourceService } from './../../resource.service';
import { ILink } from '@controlpanel/manage/links/link.interface';
import { ResourcesUtilsService } from '../../resources.utils.service';

interface IState {
  loading: boolean;
  resources: ILink[];
  showEditModal: boolean;
  showCreateModal: boolean;
  editingResource: ILink;
}

@Component({
  selector: 'cp-personas-resource-list-of-list',
  templateUrl: './resource-list-of-list.component.html',
  styleUrls: ['./resource-list-of-list.component.scss']
})
export class PersonasResourceListOfListComponent implements OnInit, AfterViewInit {
  @Input() isEdit = false;
  @Input() campusLink: ILink;
  @Input() persona: IPersona;

  @Output() resourceAdded: EventEmitter<any> = new EventEmitter();

  @ViewChildren('tooltip') tooltips: QueryList<ElementRef>;

  links$;
  sortableOptions;

  meta = {
    link_params: {
      ids: []
    },
    link_type: 3,
    link_url: 'oohlala://campus_link_list'
  };

  state: IState = {
    loading: false,
    resources: [],
    showEditModal: false,
    showCreateModal: false,
    editingResource: null
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    public service: ResourceService,
    public tileService: TilesService,
    public utils: ResourcesUtilsService
  ) {}

  onCreateModal() {
    this.state = {
      ...this.state,
      showCreateModal: true
    };

    setTimeout(
      () => {
        $('#resourceCreateModal').modal();
      },

      1
    );
  }

  onEditModal(resource: ILink) {
    if (this.utils.getType(this.persona, resource) === null) {
      return;
    }
    this.state = {
      ...this.state,
      showEditModal: true,
      editingResource: resource
    };

    setTimeout(
      () => {
        $('#resourceEditModal').modal();
      },

      1
    );
  }

  errorHandler(message?: string) {
    const body = message ? message : this.cpI18n.translate('something_went_wrong');

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body,
        sticky: true,
        class: 'danger'
      }
    });
  }

  onModalClose() {
    this.state = {
      ...this.state,
      showEditModal: false,
      showCreateModal: false
    };
  }

  onError(err) {
    const error = parseErrorResponse(err.error);

    this.errorHandler(error);
  }

  onTearDown() {
    $('#resourceEditModal').modal('hide');
    $('#resourceCreateModal').modal('hide');
  }

  onCreatedResource(newResource) {
    this.state = {
      ...this.state,
      resources: [newResource, ...this.state.resources]
    };

    this.udpateMetaAndEmit();
  }

  onEditedResource(editedResource: ILink) {
    this.state = {
      ...this.state,
      resources: this.state.resources.map((res) => {
        return res.id === editedResource.id ? editedResource : res;
      })
    };

    this.udpateMetaAndEmit();
  }

  udpateMetaAndEmit() {
    const ids = this.state.resources.map((r) => r.id);

    this.meta = {
      ...this.meta,
      link_params: ids.length ? { ids } : null
    };

    this.resourceAdded.emit(this.meta);
  }

  fetchLinks() {
    const {
      link_params: { ids }
    } = this.campusLink;

    if (!ids) {
      return;
    }

    this.state = {
      ...this.state,
      loading: true
    };

    const campusLinkIdsString = ids.map((n) => String(n)).join(',');

    const search = new HttpParams()
      .set('school_id', String(this.session.school.id))
      .set('campus_link_ids', campusLinkIdsString);

    const stream$ = this.service.getCampusLink(search, 1, 9000);

    stream$.subscribe(
      (resources: any) => {
        const sortedResources = ids
          .map((id) => resources.filter((r) => r.id === id)[0])
          .map((r) => {
            return {
              ...r,
              disabled: this.utils.getType(this.persona, r) === null
            };
          });

        this.state = {
          ...this.state,
          loading: false,
          resources: sortedResources
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

  onDragged() {
    this.udpateMetaAndEmit();
  }

  ngAfterViewInit() {
    this.tooltips.changes.subscribe((t: QueryList<ElementRef>) => {
      t.forEach((r: ElementRef) => $(r.nativeElement).tooltip());
    });
  }

  ngOnInit(): void {
    this.sortableOptions = {
      scroll: false,
      onUpdate: this.onDragged.bind(this)
    };

    if (this.isEdit) {
      this.fetchLinks();
    }
  }
}
