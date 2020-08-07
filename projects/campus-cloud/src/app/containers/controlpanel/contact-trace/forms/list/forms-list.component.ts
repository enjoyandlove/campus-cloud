import { Component, OnInit } from '@angular/core';
import { StoreCategory } from '@campus-cloud/shared/services';
import { CPSession } from '@campus-cloud/session';
import { ContactTraceHeaderService } from '@controlpanel/contact-trace/utils';
import { merge, Observable, of, Subject } from 'rxjs';
import { Form, FormStatus } from '../models';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  map,
  share,
  startWith,
  switchMap
} from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { FormsService } from '@controlpanel/contact-trace/forms/services';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-forms-list',
  templateUrl: './forms-list.component.html',
  styleUrls: ['./forms-list.component.scss']
})
export class FormsListComponent implements OnInit {
  webServiceCallInProgress: boolean;

  searchTerm: string;
  searchTermStream = new Subject<string>();
  pageStream = new Subject<number>();
  filterStream = new Subject<FormStatus>();
  hasMorePages = false;

  filter: FormStatus;
  pageCounter = 1;
  paginationCountPerPage = 25;
  results: Form[] = [];

  constructor(
    private session: CPSession,
    private headerService: ContactTraceHeaderService,
    private formsService: FormsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader();

    this.formsService.setFormBeingEdited(null);

    const searchSource = this.searchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm) => {
        this.searchTerm = searchTerm;
        this.pageCounter = 1;
        return { searchTerm: searchTerm, page: this.pageCounter };
      })
    );

    const pageSource = this.pageStream.pipe(
      map((pageNumber) => {
        this.pageCounter = pageNumber;
        return { searchTerm: this.searchTerm, page: pageNumber };
      })
    );

    const filterSource = this.filterStream.pipe(
      map((filter) => {
        this.filter = filter;
        return { searchTerm: this.searchTerm, page: this.pageCounter };
      })
    );

    const combinedSource: Observable<any[]> = merge(pageSource, searchSource, filterSource).pipe(
      startWith({ searchTerm: this.searchTerm, page: this.pageCounter }),
      switchMap((args: { searchTerm: string; page: number }) => {
        return this.fetch(args.page, this.paginationCountPerPage);
      }),
      share()
    );

    combinedSource.subscribe((data) => this.handleDataLoad(data));
  }

  fetch(pageNumber: number, paginationCountPerPage: number): Observable<Form[]> {
    let startRecordCount = paginationCountPerPage * (pageNumber - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    let endRecordCount = paginationCountPerPage * pageNumber + 1;
    const hostCategories = [StoreCategory.services, StoreCategory.clubs, StoreCategory.athletics];
    const params = new HttpParams()
      .set('search_str', this.searchTerm === '' ? null : this.searchTerm)
      .set('school_id', this.session.school.id.toString())
      .set('status', this.filter === null || this.filter === undefined ? null : '' + this.filter)
      .set('is_template', 'false');
    this.webServiceCallInProgress = true;
    return this.formsService.searchForms(startRecordCount, endRecordCount, params).pipe(
      map((stores: Form[]) => {
        if (stores && stores.length > this.paginationCountPerPage) {
          this.hasMorePages = true;
          // Remove the extra record that we fetched to check if we have more records to fetch.
          stores = stores.splice(0, this.paginationCountPerPage);
        } else {
          this.hasMorePages = false;
        }
        return stores;
      }),
      finalize(() => (this.webServiceCallInProgress = false)),
      catchError(() => {
        this.hasMorePages = false;
        return of([]);
      })
    );
  }

  private handleDataLoad(data: Form[]) {
    this.results = data;
  }

  onPaginationNext() {
    this.pageCounter++;
    this.pageStream.next(this.pageCounter);
  }

  onPaginationPrevious() {
    this.pageCounter--;
    this.pageStream.next(this.pageCounter);
  }

  onLaunchCreateModal(): void {
    this.router.navigate(['/contact-trace/forms/edit', 0, 'info']);
  }

  onSearch(search_str) {
    this.searchTermStream.next(search_str);
  }

  itemUpdateHandler(): void {
    // Refresh items on current page
    this.pageStream.next(this.pageCounter);
  }

  filterChangeHandler({ action }: { label?: string; action?: FormStatus }): void {
    this.filterStream.next(action);
  }
}
