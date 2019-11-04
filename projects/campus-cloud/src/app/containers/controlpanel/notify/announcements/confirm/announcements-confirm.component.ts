import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';

import { CPI18nService, MODAL_DATA, IModal } from '@campus-cloud/shared/services';

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

  constructor(private cpI18n: CPI18nService, @Inject(MODAL_DATA) public modal: IModal) {}

  doTeardown() {
    this.modal.onClose();
    this.teardown.emit();
  }

  onCofirm() {
    this.modal.onAction();
  }

  getTitle() {
    const state = this.modal.data;

    if (!this.modal) {
      return this.cpI18n.translate('announcement_confirm_campus_wide');
    }

    if (state.isCampusWide && state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_and_emergency');
    }

    if (state.isCampusWide && state.isUrgent) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_and_urgent');
    }

    if (!state.isCampusWide && state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_emergency');
    }

    if (!state.isCampusWide && state.isUrgent) {
      return this.cpI18n.translate('announcement_confirm_urgent');
    }

    return this.cpI18n.translate('announcement_confirm_campus_wide');
  }

  getBody() {
    const state = this.modal.data;
    if (!state) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_body');
    }
    if (state.isCampusWide && state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_and_emergency_body');
    }

    if (state.isCampusWide && state.isUrgent) {
      return this.cpI18n.translate('announcement_confirm_campus_wide_and_urgent_body');
    }

    if (!state.isCampusWide && state.isEmergency) {
      return this.cpI18n.translate('announcement_confirm_emergency_body');
    }

    if (!state.isCampusWide && state.isUrgent) {
      return this.cpI18n.translate('announcement_confirm_urgent_body');
    }

    return this.cpI18n.translate('announcement_confirm_campus_wide_body');
  }

  ngOnInit() {
    this.title = this.getTitle();
    this.body = this.getBody();
  }
}
