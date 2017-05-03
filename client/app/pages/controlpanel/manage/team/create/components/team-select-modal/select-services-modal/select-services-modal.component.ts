import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  @Output() selected: EventEmitter<any> = new EventEmitter();
  data$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(private service: ServicesService) {
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
    this
      .service
      .getServices(1, 1000)
      .subscribe(services => {
        let res = {};
        let selected = {};

        if (this.selectedServices) {
          // selected = this.filterServiceDataFromAccountPrivilege();
          selected = {
            9952: {
              r: true,
              w: true
            },
            9951: {
              r: true,
              w: false
            }
          };
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

        this.data$.next(res);
      });
  }
}
