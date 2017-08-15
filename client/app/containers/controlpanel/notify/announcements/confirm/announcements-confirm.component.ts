import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

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

  constructor() { }

  onCofirm() {
    this.confirmed.emit();
  }

  getTitle() {
    if (this.state.isCampusWide && this.state.isEmergency) {
      return 'Campus Wide and Emergency Announcement'
    }

    if (this.state.isCampusWide && !this.state.isEmergency) {
      return 'Campus Wide Announcement'
    }

    if (!this.state.isCampusWide && this.state.isEmergency) {
      return 'Emergency Announcement'
    }

    return 'Campus Wide Announcement';
  }

  getBody() {
    if (this.state.isCampusWide && this.state.isEmergency) {
      return 'You are about to send a campus wide, emergency announcement.';
    }

    if (this.state.isCampusWide && !this.state.isEmergency) {
      return 'You are about to send a campus wide announcement.';
    }

    if (!this.state.isCampusWide && this.state.isEmergency) {
      return 'You are about to send an emergency announcement.';
    }

    return 'You are about to send a campus wide announcement.';
  }

  ngOnInit() {
    this.title = this.getTitle();
    this.body = this.getBody();

    console.log(this.state);
  }
}
