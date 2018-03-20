import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-orientation-members',
  template: `<cp-clubs-members
              [isOrientation]="isOrientation">
             </cp-clubs-members>`,
})
export class OrientationMembersComponent implements OnInit {
  @Input() isOrientation;

  constructor() {}

  ngOnInit() {}
}
