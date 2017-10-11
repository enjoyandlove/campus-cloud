/**
 * Base Component
 * Loading State, Pagination....
 */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const maxPerPage = 100;

@Component({
  selector: 'cp-base-component',
  template: '',
})
export class BaseComponent implements OnInit {
  pageNext;
  pagePrev;
  private _isLoading = new Subject<boolean>();
  private _isLoading$ = this._isLoading.asObservable();

  constructor(
    public endRange = maxPerPage,
    public startRange = 1,
    public pageNumber = 1,
    public resultsPerPage = maxPerPage,
  ) { }

  fetchData(service: Observable<any>) {
    this._isLoading.next(true);
    return service
      .toPromise()
      .then(res => {
        this.pageNext = true;
        this.pagePrev = true;

        if (this.pageNumber === 1) {
          this.pagePrev = false;
        }

        if (res.length < this.resultsPerPage) {
          this.pageNext = false;
        }

        this._isLoading.next(false);

        return Promise.resolve({
          data: res,
          pageNext: this.pageNext,
          pagePrev: this.pagePrev
        });
      })
      .catch(err => {
        this._isLoading.next(false);
        return Promise.reject(err);
      });
  }

  goToNext(): void {
    this.pageNumber += 1;
    this.startRange = this.endRange + 1;
    this.endRange = this.endRange + this.resultsPerPage;
  }

  resetPagination(): void {
    this.pageNumber = 1;
    this.startRange = 1;
    this.endRange = 100;
  }

  goToPrevious(): void {
    if (this.pageNumber === 1) { return; };
    this.pageNumber -= 1;

    this.endRange = this.startRange - 1;
    this.startRange = (this.endRange - this.resultsPerPage) + 1;
  }

  isLoading(): Observable<boolean> {
    return this._isLoading$;
  }

  ngOnInit() { }
}
