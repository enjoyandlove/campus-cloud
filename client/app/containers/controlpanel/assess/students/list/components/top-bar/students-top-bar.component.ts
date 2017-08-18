import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { StudentsService } from './../../../students.service';
import { CPSession } from './../../../../../../../session/index';

interface IState {
  search_str: string,
  list_id: number
}

@Component({
  selector: 'cp-students-top-bar',
  templateUrl: './students-top-bar.component.html',
  styleUrls: ['./students-top-bar.component.scss']
})
export class StudentsTopBarComponent implements OnInit {
  @Output() filter: EventEmitter<IState> = new EventEmitter();
  @Output() query: EventEmitter<string> = new EventEmitter();

  lists$: Observable<any>;

  state: IState = {
    search_str: null,
    list_id: null
  }

  constructor(
    private session: CPSession,
    private service: StudentsService
  ) { }

  onListSelected(list_id) {
    this.state = Object.assign(
      {},
      this.state,
      { list_id }
    )
    this.filter.emit(this.state);
  }

  onSearch(search_str) {
    this.state = Object.assign(
      {},
      this.state,
      { search_str }
    )
    this.filter.emit(this.state);
  }

  ngOnInit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this.lists$ = this
      .service
      .getLists(search, 1, 1000)
      .startWith([
        {
          'label': 'All Students',
          'id': null
        }
      ])
      .map(lists => {
      let items = [
        {
          'label': 'All Students',
          'id': null
        }
      ];

      lists.map(list => {
        items.push(
          {
            'label': list.name,
            'id': list.id
          }
        )
      });
      return items;
    });

    this.lists$.subscribe();
  }
}
