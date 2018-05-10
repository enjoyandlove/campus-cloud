import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

const ALL_ENGAGEMENTS = 0;
const SERVICES_ENGAGEMENTS = 1;
const EVENTS_ENGAGEMENTS = 2;

@Component({
  selector: 'cp-profile-top-bar',
  templateUrl: './profile-top-bar.component.html',
  styleUrls: ['./profile-top-bar.component.scss']
})
export class StudentsProfileTopBarComponent implements OnInit {
  @Output() filter: EventEmitter<number> = new EventEmitter();
  @Output() download: EventEmitter<null> = new EventEmitter();

  dropdown = [];

  constructor(public cpI18n: CPI18nService) {}

  ngOnInit() {
    this.dropdown = [
      {
        label: this.cpI18n.translate('assess_all_engagements'),
        action: ALL_ENGAGEMENTS
      },
      {
        label: this.cpI18n.translate('assess_all_events'),
        action: EVENTS_ENGAGEMENTS
      },
      {
        label: this.cpI18n.translate('assess_all_services'),
        action: SERVICES_ENGAGEMENTS
      }
    ];
  }
}
