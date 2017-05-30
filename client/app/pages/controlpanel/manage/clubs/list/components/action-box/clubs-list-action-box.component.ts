import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface IState {
  query: string;
  type: string;
}

const state: IState = {
  query: null,
  type: null
};

@Component({
  selector: 'cp-clubs-list-action-box',
  templateUrl: './clubs-list-action-box.component.html',
  styleUrls: ['./clubs-list-action-box.component.scss']
})
export class ClubsListActionBoxComponent implements OnInit {
  @Output() filter: EventEmitter<IState> = new EventEmitter();

  clubFilter;
  state: IState = state;

  constructor() { }

  onUpdateState(data, key: string): void {
    this.state = Object.assign({}, this.state, { [key]: data });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    this.clubFilter = [
      {
        label: 'All Clubs',
        action: null
      },
      {
        label: 'Activated',
        action: 1
      },
      {
        label: 'Pending',
        action: 0
      }
    ];
  }
}
