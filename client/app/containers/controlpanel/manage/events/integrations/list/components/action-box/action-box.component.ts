import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cp-event-integrations-action-box',
  templateUrl: './action-box.component.html',
  styleUrls: ['./action-box.component.scss']
})
export class EventIntegrationsActionBoxComponent implements OnInit {
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
