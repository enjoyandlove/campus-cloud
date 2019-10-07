import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-team-profile-form',
  templateUrl: './team-profile-form.component.html',
  styleUrls: ['./team-profile-form.component.scss']
})
export class TeamProfileFormComponent implements OnInit {
  @Input() isEdit;
  @Input() isCurrentUser;
  @Input() form: FormGroup;
  @Input() isAllAccessEnabled;

  @Output() toggleAllAccess: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onToggleAllAccess(checked) {
    this.toggleAllAccess.emit(checked);
  }

  ngOnInit() {}
}
