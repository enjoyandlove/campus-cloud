import { catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CPSession } from './../../../../../../../session';
import { TilesService } from './../../tiles.service';
import { StoreService } from '../../../../../../../shared/services';
import { of } from 'rxjs';

@Component({
  selector: 'cp-personas-forms-type-search',
  templateUrl: './forms-type-search.component.html',
  styleUrls: ['./forms-type-search.component.scss']
})
export class PersonasTileFormTypeSearchComponent implements OnInit {
  @Input()
  set resourceId(resourceId) {
    this.loadItemsByResourceId(resourceId);
  }

  @Output() selected: EventEmitter<any> = new EventEmitter();

  items$;

  constructor(
    public storeService: StoreService,
    public session: CPSession,
    public tileService: TilesService
  ) {}

  onSelected(id) {
    this.selected.emit({
      meta: {
        is_system: 1,
        link_params: {
          id
        },
        open_in_browser: 0,
        link_url: 'oohlala://store'
      }
    });
  }

  loadItemsByResourceId(resourceId) {
    if (resourceId === 'school_campaign') {
      this.loadCampaigns();
    } else if (resourceId === 'campus_service') {
      this.loadServices();
    } else if (resourceId === 'subscribable_calendar') {
      this.loadCalendars();
    } else {
      this.loadStores();
    }
  }

  handleError() {
    return (this.items$ = of([{ label: 'ERROR' }]));
  }

  loadServices() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService
      .getSchoolServices(headers)
      .pipe(catchError(() => this.handleError()));
  }

  loadCampaigns() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService
      .getSchoolCampaigns(headers)
      .pipe(catchError(() => this.handleError()));
  }

  loadCalendars() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.tileService
      .getSchoolCalendars(headers)
      .pipe(catchError(() => this.handleError()));
  }

  loadStores() {
    const headers = new HttpParams().set('school_id', this.session.g.get('school').id);
    this.items$ = this.storeService.getStores(headers);
  }

  ngOnInit(): void {}
}
