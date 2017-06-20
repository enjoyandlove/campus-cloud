import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-list-recipients',
  templateUrl: './list-recipients.component.html',
  styleUrls: ['./list-recipients.component.scss']
})
export class AnnouncementsListRecipientsComponent implements OnInit {
  @Input() lists: Array<{ id: number, name: string }>;
  @Input() users: Array<{ id: number, firstname: string, lastname: string }>;

  maxAllowed = 3;
  recipients: Array<string> = [];
  recipients_more: Array<string> = [];

  constructor() { }

  ngOnInit() {
    if (this.lists.length) {
      this.lists.map((item, index) => {
        if (index + 1 <= this.maxAllowed) {
          this.recipients.push(item.name);
          return;
        }
        this.recipients_more.push(item.name);
      });
    }
    if (this.users.length) {
      this.users.map((item, index) => {
        if (index + 1 <= this.maxAllowed) {
          this.recipients.push(`${item.firstname} ${item.lastname}`);
          return;
        }
        this.recipients_more.push(`${item.firstname} ${item.lastname}`);
      });
    }
  }
}
