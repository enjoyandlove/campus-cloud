/**
 * Base Component
 * Loading State, Pagination....
 */
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export abstract class BaseComponent {
  public pageNext;
  public pagePrev;
  public pageNumber = 1;
  public startRange = 1;
  public maxPerPage = 100;
  public endRange = this.maxPerPage + 1;

  private _isLoading = new Subject<boolean>();
  private _isLoading$ = this._isLoading.asObservable();

  fetchData(request: Observable<any>) {
    this._isLoading.next(true);

    return request
      .toPromise()
      .then((response) => {
        this.pageNext = false;
        this.pagePrev = false;

        if (this.pageNumber > 1) {
          this.pagePrev = true;
        }

        if (response.length > this.maxPerPage) {
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
      .catch((err) => Promise.reject(err));
  }

  goToNext(): void {
    this.startRange = this.endRange;
    this.endRange = this.endRange + this.maxPerPage;

    this.pageNumber += 1;
  }

  resetPagination(): void {
    this.pageNumber = 1;
    this.startRange = 1;
    this.endRange = this.maxPerPage + 1;
  }

  goToPrevious(): void {
    if (this.pageNumber === 1) {
      return;
    }
    this.endRange -= this.maxPerPage;
    this.startRange -= this.maxPerPage;

    this.pageNumber -= 1;
  }

  isLoading(): Observable<boolean> {
    return this._isLoading$;
  }
}
