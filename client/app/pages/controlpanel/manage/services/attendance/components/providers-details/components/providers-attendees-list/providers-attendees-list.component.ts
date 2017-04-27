import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ProvidersService } from '../../../../../providers.service';
import { FORMAT } from '../../../../../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../../../../../base/base.component';

@Component({
  selector: 'cp-providers-attendees-list',
  templateUrl: './providers-attendees-list.component.html',
  styleUrls: ['./providers-attendees-list.component.scss']
})
export class ServicesProvidersAttendeesListComponent extends BaseComponent implements OnInit {
  @Input() serviceId: number;
  @Input() providerId: number;

  loading;
  assessments;
  checkinMethods;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  fetch() {
    let search = new URLSearchParams();
    search.append('service_id', this.serviceId.toString());
    search.append('service_provider_id', this.providerId.toString());

    const stream$ = this
      .providersService
      .getProviderAssessments(this.startRange, this.endRange, search);

    super
      .fetchData(stream$)
      .then(res => {
        console.log(res.data);
        this.assessments = res.data;
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();

    this.checkinMethods = {
      '1': {
        label: 'Web check-in'
      },
      '3': {
        label: 'App check-in'
      }
    };
  }
}
