import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-announcements-confirm',
  templateUrl: './announcements-confirm.component.html',
  styleUrls: ['./announcements-confirm.component.scss']
})
export class AnnouncementsConfirmComponent implements OnInit {
  @Input() state: any;

  @Output() confirmed: EventEmitter<null> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  title;
  body;

  constructor(private cpI18n: CPI18nService) {}

  onCofirm() {
    this.confirmed.emit();
  }

  getTitle() {
    if (!this.state) {
      return this.cpI18n.translate('announcement_confirm_campus_wide');
    }

    if (this.state.isCampusWide && this.state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_and_emergency');
    }

    if (this.state.isCampusWide && !this.state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_campus_wide');
    }

    if (!this.state.isCampusWide && this.state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_emergency');
    }

    return this.cpI18n.translate('announcement_confirm_campus_wide');
  }

  getBody() {
    if (!this.state) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_body');
    }
    if (this.state.isCampusWide && this.state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_and_emergency_body');
    }

    if (this.state.isCampusWide && !this.state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_body');
    }

    if (!this.state.isCampusWide && this.state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_emergency_body');
    }

    return this.cpI18n.translate('announcement_confirm_campus_wide_body');
  }

  ngOnInit() {
    this.title = this.getTitle();
    this.body = this.getBody();
  }
}
