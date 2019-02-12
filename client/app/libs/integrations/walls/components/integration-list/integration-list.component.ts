import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { IItem } from '@shared/components';
import { FORMAT } from '@client/app/shared/pipes';
import { IWallsIntegration } from './../../model';
import { SyncStatus } from '../../../common/model';

@Component({
  selector: 'cp-walls-integration-list',
  templateUrl: './integration-list.component.html',
  styleUrls: ['./integration-list.component.scss']
})
export class WallsIntegrationListComponent implements OnInit {
  @Input() channels: IItem[];
  @Input() integrations$: Observable<IWallsIntegration[]>;

  @Output() editClick: EventEmitter<IWallsIntegration> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IWallsIntegration> = new EventEmitter();

  dateFormat = FORMAT.DATETIME;
  notSynced = SyncStatus.notSynced;

  constructor() {}

  ngOnInit() {}
}
