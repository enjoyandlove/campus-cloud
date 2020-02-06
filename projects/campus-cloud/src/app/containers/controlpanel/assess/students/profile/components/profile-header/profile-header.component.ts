import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { UserService } from '@campus-cloud/shared/services';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
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
  canManageAppUsers = false;

  constructor(private userService: UserService, private session: CPSession) {}

  get fullName() {
    return `${this.student.firstname} ${this.student.lastname}`;
  }

  get isMuted() {
    return this.student.social_restriction || this.muted;
  }

  ngOnInit() {
    const defaultAvatar = `${environment.root}assets/default/user.png`;
    this.canManageAppUsers = canSchoolReadResource(
      this.session.g,
      CP_PRIVILEGES_MAP.app_user_management
    );
    this.avatarUrl = this.student.avatar <= 3 ? defaultAvatar : this.student.avatar_url;
  }

  onMute(social_restriction: boolean) {
    this.userService
      .updateById(this.student.id, { social_restriction })
      .subscribe(() => (this.muted = social_restriction));
  }
}
