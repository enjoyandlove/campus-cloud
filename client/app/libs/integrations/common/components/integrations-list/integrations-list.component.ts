import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Observable } from 'rxjs';

import { SyncStatus } from './../../model';
import { FeedIntegration } from './../../model/integration.model';

@Component({
  selector: 'cp-integrations-list',
  templateUrl: './integrations-list.component.html',
  styleUrls: ['./integrations-list.component.scss']
})
export class IntegrationsListComponent implements OnInit {
  @Input() integrations$: Observable<FeedIntegration[]>;

  @Output() editClick: EventEmitter<FeedIntegration> = new EventEmitter();
  @Output() deleteClick: EventEmitter<FeedIntegration> = new EventEmitter();

  notSynced = SyncStatus.notSynced;

  constructor() {}

  ngOnInit() {}
}
