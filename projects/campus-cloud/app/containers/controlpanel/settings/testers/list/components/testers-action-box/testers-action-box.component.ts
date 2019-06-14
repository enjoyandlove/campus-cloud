import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cp-testers-action-box',
  templateUrl: './testers-action-box.component.html',
  styleUrls: ['./testers-action-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestersActionBoxComponent implements OnInit {
  @Output() onCreate: EventEmitter<null> = new EventEmitter();
  @Output() onSearch: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
