/**
 * Base Component
 * Loading State, Pagination....
 */
import { Observable, Subject } from 'rxjs';

export abstract class BaseComponent {
  public pageNext;
  public pagePrev;
  public pageNumber = 1;
  public startRange = 1;
  public maxPerPage = 100;
  public endRange = this.maxPerPage + 1;

  private _isLoading = new Subject<boolean>();
  private _isLoading$ = this._isLoading.asObservable();

  updatePagination(response) {
    this.pageNext = false;
    this.pagePrev = this.pageNumber > 1;

    if (response.length > this.maxPerPage) {
      this.pageNext = true;
      response.pop();
    }
    return response;
  }

  async fetchData(request: Observable<any>) {
    this._isLoading.next(true);

    try {
      const response = await request.toPromise();
      const data = this.updatePagination(response);
      this._isLoading.next(false);
      return Promise.resolve({
        data,
        pageNext: this.pageNext,
        pagePrev: this.pagePrev
      });
    } catch (err) {
      return Promise.reject(err);
    }
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
