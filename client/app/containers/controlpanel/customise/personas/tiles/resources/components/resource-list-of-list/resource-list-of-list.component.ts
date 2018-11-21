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

import { TilesService } from '../../../tiles.service';
import { IPersona } from './../../../../persona.interface';
import { ResourceService } from './../../resource.service';
import { CPSession } from '../../../../../../../../session';
import { ILink } from '../../../../../../manage/links/link.interface';
import { ResourcesUtilsService } from '../../resources.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';
import { baseActions, ISnackbar } from '../../../../../../../../store/base';

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
  @Input() persona: IPersona;
  @Input() selectedIds: Number[];

  @Output() resourceAdded: EventEmitter<any> = new EventEmitter();

  @ViewChildren('tooltip') tooltips: QueryList<ElementRef>;

  links$;
  sortableOptions;

  meta = {
    is_system: 1,
    link_params: {
      ids: []
    },
    open_in_browser: 0,
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

  errorHandler() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong')
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
        const sortedResources = this.selectedIds
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

    if (this.selectedIds) {
      this.fetchLinks();
    }
  }
}
