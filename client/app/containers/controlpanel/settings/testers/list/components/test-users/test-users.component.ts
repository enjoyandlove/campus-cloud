import { EventEmitter, Component, OnInit, Output, Input } from '@angular/core';

import { SortDirection } from '@shared/constants';
import { ITestUser } from '../../../models/test-user.interface';

@Component({
  selector: 'cp-test-users',
  templateUrl: './test-users.component.html',
  styleUrls: ['./test-users.component.scss']
})
export class TestUsersComponent implements OnInit {
  @Input() users: ITestUser[];
  @Input() noContentText: string;
  @Input() sortDirection: SortDirection;

  @Output() onResend: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  @Output() onSort: EventEmitter<SortDirection> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
