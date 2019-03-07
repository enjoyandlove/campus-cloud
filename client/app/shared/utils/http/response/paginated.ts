export interface PaginatedResult<T> {
  data: T[];
  next: boolean;
  previous: boolean;
}

export class Paginated {
  private _page = 1;
  private _maxPerPage = 100;

  get page() {
    return this._page;
  }

  set page(page: number) {
    if (!page || isNaN(page)) {
      page = 1;
    }

    this._page = page;
  }

  get maxPerPage() {
    return this._maxPerPage;
  }

  set maxPerPage(max: number) {
    this._maxPerPage = max;
  }

  get endRange() {
    return this.page * this._maxPerPage + 1;
  }

  get startRage() {
    return this.endRange - this.maxPerPage;
  }

  constructor() {}

  paginateResults<T>(data: T[]): PaginatedResult<T> {
    let next = false;
    const previous = this.page > 1;

    if (data.length > this.maxPerPage) {
      next = true;
      data.pop();
    }

    return {
      data,
      next,
      previous
    };
  }
}
