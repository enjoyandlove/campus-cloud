import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-announcements-confirm',
  templateUrl: './announcements-confirm.component.html',
  styleUrls: ['./announcements-confirm.component.scss']
})
export class AnnouncementsConfirmComponent implements OnInit {
  @Output() confirmed: EventEmitter<null> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  constructor() { }

  onCofirm() {
    this.confirmed.emit();
  }

  ngOnInit() { }
}
