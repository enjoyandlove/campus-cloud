import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { environment } from './../../../../../../../../environments/environment';

@Component({
  selector: 'cp-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class StudentsProfileHeaderComponent implements OnInit {
  @Input() student: any;
  @Output() message: EventEmitter<null> = new EventEmitter();

  avatarUrl;

  constructor() {}

  ngOnInit() {
    const defaultAvatar = `${environment.root}public/default/user.png`;

    this.avatarUrl = this.student.avatar <= 3 ? defaultAvatar : this.student.avatar_url;
  }
}
