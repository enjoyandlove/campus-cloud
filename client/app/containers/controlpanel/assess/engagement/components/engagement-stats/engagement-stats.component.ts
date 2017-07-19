import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cp-engagement-stats',
  templateUrl: './engagement-stats.component.html',
  styleUrls: ['./engagement-stats.component.scss']
})
export class EngagementStatsComponent implements OnInit {
  @Output() doCompose: EventEmitter<Array<number>> = new EventEmitter();

  constructor() { }

  onCompose(userList = [1, 2, 3]) {
    this.doCompose.emit(userList);
  }

  ngOnInit() { }
}
