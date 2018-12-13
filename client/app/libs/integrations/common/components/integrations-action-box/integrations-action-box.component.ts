import { Component, OnInit, EventEmitter } from '@angular/core';
import { Output } from '@angular/core';

@Component({
  selector: 'cp-integrations-action-box',
  templateUrl: './integrations-action-box.component.html',
  styleUrls: ['./integrations-action-box.component.scss']
})
export class IntegrationsActionBoxComponent implements OnInit {
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
