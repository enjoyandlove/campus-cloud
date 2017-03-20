import { Component, OnInit } from '@angular/core';

import { ILink } from '../link.interface';
import { LinksService } from '../links.service';
import { BaseComponent } from '../../../../../base/base.component';

declare var $: any;

interface IState {
  links: Array<ILink>;
}

const state: IState = {
  links: []
};


@Component({
  selector: 'cp-links-list',
  templateUrl: './links-list.component.html',
  styleUrls: ['./links-list.component.scss']
})
export class LinksListComponent extends BaseComponent implements OnInit {
  pageNext;
  pagePrev;
  pageNumber;
  isLinksEdit;
  editLink = '';
  isLinksDelete;
  isLinksCreate;
  loading = true;
  deleteLink = '';
  state: IState = state;

  constructor(
    private service: LinksService
  ) {
    super();

    this.fetch();

    super.isLoading().subscribe(res => this.loading = res);
  }

  onPaginationNext() {
    super.goToNext();
    this.pageNumber = super.getPageNumber();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.pageNumber = super.getPageNumber();

    this.fetch();
  }

  onSearch() {
    console.log('doing Search');
  }

  private fetch() {
    let end = super.getEndRange();
    let start = super.getStartRange();

    super
      .fetchData(this.service.getLinks(start, end))
      .then(res => {
        this.state.links = res.data;
        this.pageNext = res.pageNext;
        this.pagePrev = res.pagePrev;
      })
      .catch(err => console.error(err));
  }

  onLaunchCreateModal() {
    this.isLinksCreate = true;
    setTimeout(() => { $('#linksCreate').modal(); }, 1);
  }

  onCreatedLink(link: ILink) {
    this.isLinksCreate = false;
    this.state.links = [link, ...this.state.links];
  }

  onEditedLink(editedLink) {
    this.isLinksEdit = false;
    let _state = Object.assign({}, this.state, {
      links: this.state.links.map(link => {
        if (link.id === editedLink.id) {
          return link = editedLink;
        }
        return link;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeletedLink(linkId: number) {
    this.isLinksDelete = false;
    let _state = Object.assign({}, this.state);

    _state.links = _state.links.filter(link => {
      if (link.id !== linkId) { return link; }

      return;
    });

    this.state = Object.assign({}, this.state, { links: _state.links });
  }

  ngOnInit() { }
}
