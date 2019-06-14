import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IMember, MemberType } from '../../model';

@Component({
  selector: 'cp-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class LibsMembersListComponent implements OnInit {
  @Input() canEdit = true;
  @Input() sortBy: string;
  @Input() canDelete = true;
  @Input() members: IMember[];
  @Input() sortDirection: string;
  @Input() executiveLabel = 'executive';
  @Input() withStudentIdentifier = false;

  @Output() sort: EventEmitter<string> = new EventEmitter();
  @Output() editClick: EventEmitter<IMember> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IMember> = new EventEmitter();

  executiveLeaderType = MemberType.executive_leader;

  constructor() {}

  onMemberClick(member: IMember) {
    if (!this.canEdit) {
      return;
    }

    this.editClick.emit(member);
  }

  ngOnInit(): void {}
}
