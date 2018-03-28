import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ServicesService } from '../../../../../../manage/services/services.service';
import { BaseTeamSelectModalComponent } from '../base/team-select-modal.component';

import { CP_PRIVILEGES_MAP } from '../../../../../../../../shared/constants';

import { CPSession } from './../../../../../../../../session';

@Component({
  selector: 'cp-select-services-modal',
  templateUrl: './select-services-modal.component.html'
})
export class SelectTeamServicesModalComponent extends BaseTeamSelectModalComponent
  implements OnInit {
  @Input() selectedServices: any;
  @Input() reset: Observable<boolean>;

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<any> = new EventEmitter();

  data$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(public session: CPSession, private service: ServicesService) {
    super(session);
    this.privilegeType = CP_PRIVILEGES_MAP.services;
  }

  ngOnInit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service.getServices(1, 1000, search).subscribe((services) => {
      let res = {};
      const selected = {};
      if (this.selectedServices) {
        services.map((service) => {
          if (Object.keys(this.selectedServices).includes(service.store_id.toString())) {
            if (CP_PRIVILEGES_MAP.services in this.selectedServices[service.store_id]) {
              selected[service.store_id] = service;
            }
          }

          if (selected[service.store_id]) {
            service.checked = true;
            selected[service.store_id] = Object.assign({}, selected[service.store_id], {
              id: service.id
            });
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
