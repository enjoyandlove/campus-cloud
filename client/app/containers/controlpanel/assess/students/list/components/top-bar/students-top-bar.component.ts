import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CPSession } from './../../../../../../../session';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants/privileges';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';
import { canSchoolReadResource } from './../../../../../../../shared/utils/privileges/privileges';
import { StudentsService } from './../../../students.service';

interface IState {
  search_str: string;
  list_id: number;
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

  canAudience = false;
  selectedList: number;
  lists$: Observable<any>;

  state: IState = {
    search_str: null,
    list_id: null
  };

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: StudentsService
  ) {}

  onListSelected(list_id) {
    this.state = Object.assign({}, this.state, { list_id });
    this.filter.emit(this.state);
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    this.canAudience = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.audience);

    if (!this.canAudience) {
      this.lists$ = observableOf([
        {
          label: this.cpI18n.translate('assess_all_students'),
          id: null
        }
      ]);

      return;
    }

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.lists$ = this.service.getLists(search, 1, 1000).pipe(
      startWith([
        {
          label: this.cpI18n.translate('assess_all_students'),
          id: null
        }
      ]),
      map((lists) => {
        const items = [
          {
            label: this.cpI18n.translate('assess_all_students'),
            id: null
          }
        ];

        lists.map((list: any) => {
          list = {
            label: list.name,
            id: list.id
          };

          items.push(list);

          if (list.id === +this.listIdFromUrl) {
            this.selectedList = list;
          }
        });

        return items;
      })
    );
  }
}
