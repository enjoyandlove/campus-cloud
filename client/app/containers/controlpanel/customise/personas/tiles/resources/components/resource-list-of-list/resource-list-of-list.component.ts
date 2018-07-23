import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CPSession } from '../../../../../../../../session';
import { TilesService } from '../../../tiles.service';

@Component({
  selector: 'cp-personas-resource-list-of-list',
  templateUrl: './resource-list-of-list.component.html',
  styleUrls: ['./resource-list-of-list.component.scss']
})
export class PersonasResourceListOfListComponent implements OnInit {
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
    loading: true,
    resources: [],
    showModal: false
  };

  constructor(public tileService: TilesService, public session: CPSession) {}

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

  // onError(error) {}

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

    this.meta = {
      ...this.meta,
      link_params: {
        ids: this.state.resources.map((r) => r.id)
      }
    };

    this.resourceAdded.emit({ meta: this.meta });
  }

  ngOnInit(): void {}
}
