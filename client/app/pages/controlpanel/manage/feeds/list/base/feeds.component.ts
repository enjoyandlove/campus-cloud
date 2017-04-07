import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BaseComponent } from '../../../../../../base/base.component';

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent extends BaseComponent implements OnInit {
  feeds;
  loading;
  isSimple;

  constructor(
    private stream$: Observable<any>
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    console.log(this);
  }

  onDoFilter() {
    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.stream$)
      .then(res => this.feeds = res.data)
      .catch(err => console.log(err));
  }

  ngOnInit() { }
}
