import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class StudentsProfileHeaderComponent implements OnInit {
  muted = false;
  @Input() student: any;
  @Output() message: EventEmitter<null> = new EventEmitter();

  avatarUrl;

  constructor() {}

  get fullName() {
    return `${this.student.firstname} ${this.student.lastname}`;
  }

  get isMuted() {
    return this.student.social_restriction || this.muted;
  }

  ngOnInit() {
    const defaultAvatar = `${environment.root}assets/default/user.png`;

    this.avatarUrl = this.student.avatar <= 3 ? defaultAvatar : this.student.avatar_url;
  }

  onMute(mute: boolean) {
    this.muted = mute;
  }
}
