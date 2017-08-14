import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ILink } from '../link.interface';
import { LinksService } from '../links.service';
import { CPSession } from './../../../../../session/index';
import { BaseComponent } from '../../../../../base/base.component';

declare var $: any;

interface IState {
  links: Array<ILink>;
  search_str: string;
}

const state: IState = {
  links: [],
  search_str: null
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
    private session: CPSession,
    private service: LinksService
  ) {
    super();

    this.fetch();

    super.isLoading().subscribe(res => this.loading = res);
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign(
      {},
      this.state,
      { search_str }
    );
    this.fetch();
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('school_id', this.session.school.id.toString());

    let end = this.endRange;
    let start = this.startRange;

    super
      .fetchData(this.service.getLinks(start, end, search))
      .then(res => this.state.links = res.data)
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
