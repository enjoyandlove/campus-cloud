import { Component, OnInit } from '@angular/core';

import { LinksService } from '../links.service';
import { BaseComponent } from '../../../../../base/base.component';

declare var $: any;

@Component({
  selector: 'cp-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.scss']
})
export class LinksListComponent extends BaseComponent implements OnInit {
  links;
  editLink = '';
  deleteLink = '';
  loading = true;

  constructor(
    private service: LinksService
  ) {
    super();

    this.fetch();

    super.isLoading().subscribe(res => this.loading = res);
  }

  onSearch() {
    console.log('doing Search');
  }

  private fetch() {
    super
      .fetchData(this.service.getLinks())
      .then(res => {
        this.links = res;
      })
      .catch(err => console.error(err));
  }

  onLaunchCreateModal() {
    $('#linksCreate').modal();
  }

  onDelete(deleteLink) {
    this.deleteLink = deleteLink;
  }

  ngOnInit() { }
}
