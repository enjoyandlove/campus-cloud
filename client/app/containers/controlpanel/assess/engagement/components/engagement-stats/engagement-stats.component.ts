import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cp-engagement-stats',
  templateUrl: './engagement-stats.component.html',
  styleUrls: ['./engagement-stats.component.scss']
})
export class EngagementStatsComponent implements OnInit {
  @Input() props: Observable<any>;
  @Output() doCompose: EventEmitter<Array<number>> = new EventEmitter();

  loading;

  constructor() { }

  onCompose(userList = [1, 2, 3]) {
    this.doCompose.emit(userList);
  }

  ngOnInit() {
    this.props.subscribe(filterBy => {
      if (filterBy) {
        console.log('stats component ', filterBy);
      }
    });
  }
}
