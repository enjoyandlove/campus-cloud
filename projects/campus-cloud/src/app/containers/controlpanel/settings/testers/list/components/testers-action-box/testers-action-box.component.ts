import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cp-testers-action-box',
  templateUrl: './testers-action-box.component.html',
  styleUrls: ['./testers-action-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestersActionBoxComponent implements OnInit {
  @Output() create: EventEmitter<null> = new EventEmitter();
  @Output() search: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
