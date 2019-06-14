import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { FORMAT } from '@shared/pipes';
import { IStore } from '@shared/services';
import { IAnnouncementsIntegration } from '../../model';
import { SyncStatus } from '@libs/integrations/common/model';

@Component({
  selector: 'cp-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class IntegrationsListComponent implements OnInit {
  @Input() senders: IStore[];
  @Input() integrations$: Observable<IAnnouncementsIntegration[]>;

  @Output() deleteClick: EventEmitter<IAnnouncementsIntegration> = new EventEmitter();

  dateFormat = FORMAT.DATETIME;
  notSynced = SyncStatus.notSynced;
  constructor() {}

  getSender(id: number) {
    return this.senders.find((store: IStore) => store.value === id);
  }

  ngOnInit() {}
}
