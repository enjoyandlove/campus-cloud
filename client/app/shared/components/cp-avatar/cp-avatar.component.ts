import { Component, OnInit } from '@angular/core';

export const AVATAR_SIZE = {
  'SMALL': 'small',
  'LARGE': 'large',
  'DEFAULT': 'default'
};

@Component({
  selector: 'cp-avatar',
  templateUrl: './cp-avatar.component.html',
  styleUrls: ['./cp-avatar.component.scss']
})
export class CPAvatarComponent implements OnInit {
  isLoading;

  constructor() { }

  dummy() {
    this.isLoading = false;
  }

  dumm2(num: number) {
    return num * 4;
  }

  ngOnInit() {
    this.isLoading = true;
  }
}
