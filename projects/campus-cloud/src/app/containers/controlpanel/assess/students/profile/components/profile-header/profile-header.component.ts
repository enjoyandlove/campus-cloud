import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';
import { CPTrackingService, UserService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { StudentsAmplitudeService } from '@controlpanel/assess/students/students.amplitude.service';

@Component({
  selector: 'cp-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class StudentsProfileHeaderComponent implements OnInit {
  muted;
  @Input() student: any;
  @Output() message: EventEmitter<null> = new EventEmitter();

  avatarUrl;
  canManageAppUsers = false;

  constructor(
    private session: CPSession,
    private userService: UserService,
    private cpTracking: CPTrackingService,
    private amplitudeService: StudentsAmplitudeService
  ) {}

  get fullName() {
    return `${this.student.firstname} ${this.student.lastname}`;
  }

  get isMuted() {
    return typeof this.muted === 'undefined' ? this.student.social_restriction : this.muted;
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
    const school_id = this.session.school.id;
    this.userService
      .updateById(this.student.id, { school_id, social_restriction })
      .subscribe(() => {
        this.muted = social_restriction;
        this.trackMuteUser(social_restriction);
      });
  }

  trackMuteUser(restriction) {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MUTED_USER,
      this.amplitudeService.muteUserAmplitudeProperties(this.student.id, restriction)
    );
  }
}
