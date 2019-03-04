import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { FORMAT } from '@shared/pipes';
import { SyncStatus } from '@libs/integrations/common/model';
import { IAnnoucementsIntegration } from './../../model/walls-integration.interface';

@Component({
  selector: 'cp-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class IntegrationsListComponent implements OnInit {
  @Input() integrations$: Observable<IAnnoucementsIntegration[]>;

  @Output() syncClick: EventEmitter<number> = new EventEmitter();
  @Output() deleteClick: EventEmitter<IAnnoucementsIntegration> = new EventEmitter();

  dateFormat = FORMAT.DATETIME;
  notSynced = SyncStatus.notSynced;
  constructor() {}

  ngOnInit() {}
}
