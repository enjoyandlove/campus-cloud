import { Component, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { IItem } from '@campus-cloud/shared/components';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { IWallsIntegration } from './../../model';
import { SyncStatus } from '../../../common/model';

@Component({
  selector: 'cp-walls-integration-list',
  templateUrl: './integration-list.component.html',
  styleUrls: ['./integration-list.component.scss']
})
export class WallsIntegrationListComponent {
  @Input() channels: IItem[];
  @Input() integrations$: Observable<IWallsIntegration[]>;

  @Output() syncClick: EventEmitter<number> = new EventEmitter();
  @Output() editClick: EventEmitter<IWallsIntegration> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IWallsIntegration> = new EventEmitter();

  dateFormat = FORMAT.DATETIME;
  notSynced = SyncStatus.notSynced;
}
