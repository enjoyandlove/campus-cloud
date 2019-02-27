import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SORT_DIRECTION } from '@shared/constants';
import { ITestUser } from '@libs/testers/model/test-user.interface';

@Component({
  selector: 'cp-test-users',
  templateUrl: './test-users.component.html',
  styleUrls: ['./test-users.component.scss']
})
export class TestUsersComponent implements OnInit {
  @Input() users: ITestUser[];
  @Input() sortDirection: SORT_DIRECTION;

  @Output() onResend: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  @Output() onSort: EventEmitter<SORT_DIRECTION> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
