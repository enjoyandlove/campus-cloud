import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-base-checkin',
  templateUrl: './base-checkin.component.html',
  styleUrls: ['./base-checkin.component.scss']
})
export class BaseCheckinComponent implements OnInit {
  @Input() data: any;
  @Output() send: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
