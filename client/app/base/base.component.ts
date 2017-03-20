/**
 * Base Component
 * Loading State, Pagination....
 */
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
    private _endRange = 100,
    private _startRange = 1,
    private _pageNumber = 1,
    private _resultsPerPage = 100,
  ) { }

  getEndRange(): number {
    return this._endRange;
  }

  getStartRange(): number {
    return this._startRange;
  }

  getPageNumber(): number {
    return this._pageNumber;
  }

  fetchData(service: Observable<any>) {
    this._isLoading.next(true);
    return service
      .toPromise()
      .then(res => {
        this.pageNext = true;
        this.pagePrev = true;

        if (this._pageNumber === 1) {
          this.pagePrev = false;
        }

        if (res.length < this._resultsPerPage) {
          this.pageNext = false;
        }

        this._isLoading.next(false);

        return {
          data: res,
          pageNext: this.pageNext,
          pagePrev: this.pagePrev
        };
      })
      .catch(err => {
        this._isLoading.next(false);
        return err;
      });
  }

  goToNext(): void {
    this._pageNumber += 1;
    this._startRange = this._endRange + 1;
    this._endRange = this._endRange + this._resultsPerPage;
  }

  goToPrevious(): void {
    if (this._pageNumber === 1) { return; };
    this._pageNumber -= 1;

    this._endRange = this._startRange - 1;
    this._startRange = (this._endRange - this._resultsPerPage) + 1;
  }

  isLoading(): Observable<boolean> {
    return this._isLoading$;
  }

  ngOnInit() { }
}
