import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { CPSession } from './../../../../../../../session';
import { StudentsService } from './../../../students.service';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

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
  @Input() listIdFromUrl: number;
  @Output() filter: EventEmitter<IState> = new EventEmitter();
  @Output() query: EventEmitter<string> = new EventEmitter();

  selectedList: number;
  lists$: Observable<any>;

  state: IState = {
    search_str: null,
    list_id: null
  }

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: StudentsService
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
    search.append('school_id', this.session.g.get('school').id.toString());

    this.lists$ = this
      .service
      .getLists(search, 1, 1000)
      .startWith([
        {
          'label': this.cpI18n.translate('assess_all_students'),
          'id': null
        }
      ])
      .map(lists => {
        let items = [
          {
            'label': this.cpI18n.translate('assess_all_students'),
            'id': null
          }
        ];

        lists.map(list => {
          list = {
            'label': list.name,
            'id': list.id
          }

          items.push(list);

          if (list.id === +this.listIdFromUrl) {
            this.selectedList = list;
          }

        });
        return items;
      });

    this.lists$.subscribe();
  }
}
