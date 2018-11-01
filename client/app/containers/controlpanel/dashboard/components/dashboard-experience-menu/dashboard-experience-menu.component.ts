import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';
import { PersonaType } from './../../../assess/engagement/engagement.status';

@Component({
  selector: 'cp-dashboard-experience-menu',
  templateUrl: './dashboard-experience-menu.component.html',
  styleUrls: ['./dashboard-experience-menu.component.scss']
})
export class DashboardExperienceMenuComponent implements OnInit {
  @Output() selected: EventEmitter<number> = new EventEmitter();

  items = [{ label: '---' }];
  experiences$: Observable<[{ action: number; label: string; platform: number }]>;

  constructor(public service: DashboardService, public session: CPSession) {}

  ngOnInit(): void {
    const search = new HttpParams()
      .set('school_id', this.session.g.get('school').id)
      .set('platform', PersonaType.app.toString());
    this.experiences$ = this.service.getPersonas(search).pipe(
      tap((data) => {
        const _data = [...data];
        const initialValue = _data.filter((d) => d.action)[0];

        if (initialValue) {
          this.selected.emit(initialValue.action);
        }

        return data;
      })
    );
  }
}
