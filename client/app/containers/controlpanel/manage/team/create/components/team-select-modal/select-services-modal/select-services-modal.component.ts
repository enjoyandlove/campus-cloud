import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CPSession } from './../../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from '../../../../../../../../shared/utils';
import { ServicesService } from '../../../../../services/services.service';
import { BaseTeamSelectModalComponent } from '../base/team-select-modal.component';

@Component({
  selector: 'cp-select-services-modal',
  templateUrl: './select-services-modal.component.html'
})
export class SelectTeamServicesModalComponent extends BaseTeamSelectModalComponent
  implements OnInit {
  @Input() selectedServices: any;
  @Input() reset: Observable<boolean>;
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<any> = new EventEmitter();
  data$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    private session: CPSession,
    private service: ServicesService,
  ) {
    super();
    this.privilegeType = CP_PRIVILEGES_MAP.services;
  }

  filterServiceDataFromAccountPrivilege() {
    let _selectedServices = {};
    Object.keys(this.selectedServices).forEach(storeId => {
      if (this.selectedServices[storeId][CP_PRIVILEGES_MAP.services]) {
        _selectedServices[storeId] = {
          ...this.selectedServices[storeId][CP_PRIVILEGES_MAP.services]
        };
      }
    });
    return _selectedServices;
  }

  ngOnInit() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .getServices(1, 1000, search)
      .subscribe(services => {
        let res = {};
        let selected = {};

        if (this.selectedServices) {
          selected = this.filterServiceDataFromAccountPrivilege();

          services.map(service => {
            if (selected[service.store_id]) {
              service.checked = true;
              selected[service.store_id] = Object.assign(
                {},
                selected[service.store_id],
                { id: service.id }
              );
            }
          });
        }
        res = {
          data: services,
          selected: selected
        };

        this.teardown.emit();
        this.data$.next(res);
      });
  }
}
