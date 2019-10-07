import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ServicesService } from '@controlpanel/manage/services/services.service';
import { BaseTeamSelectModalComponent } from '../base/team-select-modal.component';

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

  constructor(public el: ElementRef, public session: CPSession, private service: ServicesService) {
    super(el, session);
    this.privilegeType = CP_PRIVILEGES_MAP.services;
  }

  ngOnInit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.getServices(1, 1000, search).subscribe((services: Array<any>) => {
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
