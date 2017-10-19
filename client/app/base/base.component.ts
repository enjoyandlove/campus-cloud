/**
 * Base Component
 * Loading State, Pagination....
 */
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const maxPerPage = 100;

export abstract class BaseComponent {
  pageNext;
  pagePrev;
  private _isLoading = new Subject<boolean>();
  private _isLoading$ = this._isLoading.asObservable();

  constructor(
    public pageNumber = 1,
    public startRange = 1,
    public endRange = maxPerPage + 1,
  ) { }

  fetchData(request: Observable<any>) {
    this._isLoading.next(true);
    return request
      .toPromise()
      .then(response => {
        this.pageNext = false;
        this.pagePrev = false;

        if (this.pageNumber > 1) {
          this.pagePrev = true;
        }

        if (response.length > maxPerPage) {
          this.pageNext = true;
          response.pop();
        }

        this._isLoading.next(false);

        return Promise.resolve({
          data: response,
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
    this.startRange = this.endRange;
    this.endRange = this.endRange + maxPerPage;

    this.pageNumber += 1;
  }

  resetPagination(): void {
    this.pageNumber = 1;
    this.startRange = 1;
    this.endRange = maxPerPage + 1;
  }

  goToPrevious(): void {
    if (this.pageNumber === 1) { return; };
    this.endRange -= maxPerPage;
    this.startRange -= maxPerPage;

    this.pageNumber -= 1;
  }

  isLoading(): Observable<boolean> {
    return this._isLoading$;
  }
}
