import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { FORMAT } from '@shared/pipes';
import { IAnnouncementsIntegration } from '../../model';
import { SyncStatus } from '@libs/integrations/common/model';

@Component({
  selector: 'cp-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class IntegrationsListComponent implements OnInit {
  @Input() integrations$: Observable<IAnnouncementsIntegration[]>;

  @Output() syncClick: EventEmitter<number> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IAnnouncementsIntegration> = new EventEmitter();

  dateFormat = FORMAT.DATETIME;
  notSynced = SyncStatus.notSynced;
  constructor() {}

  ngOnInit() {}
}
