import { Component } from '@angular/core';

export const AVATAR_SIZE = {
  SMALL: 'small',
  LARGE: 'large',
  DEFAULT: 'default'
};

@Component({
  selector: 'img[cpAvatar]',
  templateUrl: './cp-avatar.component.html',
  styleUrls: ['./cp-avatar.component.scss']
})
export class CPAvatarComponent {}
