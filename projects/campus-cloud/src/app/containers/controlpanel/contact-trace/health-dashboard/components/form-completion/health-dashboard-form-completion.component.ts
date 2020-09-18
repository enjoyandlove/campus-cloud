import { Component, OnInit } from '@angular/core';
import { Form, FormStatus } from '@controlpanel/contact-trace/forms/models';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { FormsService } from '../../../forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  share,
  startWith,
  switchMap
} from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { Observable, of, Subject, merge } from 'rxjs';

@Component({
  selector: 'cp-health-dashboard-form-completion',
  templateUrl: './health-dashboard-form-completion.component.html',
  styleUrls: ['./health-dashboard-form-completion.component.scss']
})
export class HealthDashboardFormCompletionComponent implements OnInit {
  formsSearchTermStream = new Subject();
  formsPageStream = new Subject<number>();
  formsSearchTerm: string;
  formsPageCounter = 1;
  formsPaginationCountPerPage = 10;
  formsHasMorePages = false;
  formData = [];

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nPipe,
    private formsService: FormsService
  ) {}

  formsLoadMoreClickHandler(): void {
    this.formsPageCounter++;
    this.formsPageStream.next(this.formsPageCounter);
  }

  fetchForms(page): Observable<any[]> {
    let startRecordCount = this.formsPaginationCountPerPage * (page - 1) + 1;
    // Get an extra record so that we know if there are more records left to fetch
    let endRecordCount = this.formsPaginationCountPerPage * page + 1;

    let params = new HttpParams()
      .set('school_id', this.session.school.id.toString())
      .set('is_template', 'false')
      .set('status', '1')
      .set(
        'search_str',
        Boolean(this.formsSearchTerm && this.formsSearchTerm.trim().length)
          ? this.formsSearchTerm.trim()
          : null
      );

    return this.formsService.searchForms(startRecordCount, endRecordCount, params).pipe(
      map((results: any[]) => {
        if (results && results.length > this.formsPaginationCountPerPage) {
          this.formsHasMorePages = true;
          // Remove the extra record that we fetched to check if we have more records to fetch.
          results = results.splice(0, this.formsPaginationCountPerPage);
        } else {
          this.formsHasMorePages = false;
        }
        return results;
      }),
      catchError(() => of([]))
    ) as Observable<any[]>;
  }

  ngOnInit(): void {
    const formsSearchSource = this.formsSearchTermStream.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((searchTerm: string) => {
        this.formsSearchTerm = searchTerm;
        this.formsPageCounter = 1;
        return { searchTerm: searchTerm, page: this.formsPageCounter };
      })
    );

    const formsPageSource = this.formsPageStream.pipe(
      map((pageNumber) => {
        this.formsPageCounter = pageNumber;
        return { searchTerm: this.formsSearchTerm, page: pageNumber };
      })
    );

    const formsSearchCombinedSource: Observable<any[]> = merge(
      formsPageSource,
      formsSearchSource
    ).pipe(
      startWith({ searchTerm: this.formsSearchTerm, page: this.formsPageCounter }),
      switchMap((params: { searchTerm: string; page: number }) => {
        return this.fetchForms(params.page);
      }),
      share()
    );

    formsSearchCombinedSource.subscribe((data) => (this.formData = [...this.formData, ...data]));
  }
}
