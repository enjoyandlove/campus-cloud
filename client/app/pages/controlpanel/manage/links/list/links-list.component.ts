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
  endRage = 20;
  editLink = '';
  startRage = 1;
  pageNumber = 1;
  loading = true;
  deleteLink = '';
  resultsPerPage = 20;
  state: IState = state;

  isLinksEdit;
  isLinksDelete;
  isLinksCreate;

  constructor(
    private service: LinksService
  ) {
    super();

    this.fetch();

    super.isLoading().subscribe(res => this.loading = res);
  }

  onPaginationNext() {
    this.pageNumber += 1;
    this.startRage = this.endRage + 1;
    this.endRage = this.endRage + this.resultsPerPage;

    this.fetch();
  }

  onPaginationPrevious() {
    if (this.pageNumber === 1) { return; };
    this.pageNumber -= 1;

    this.endRage = this.startRage - 1;
    this.startRage = (this.endRage - this.resultsPerPage) + 1;

    this.fetch();
  }

  onSearch() {
    console.log('doing Search');
  }

  private fetch() {
    super
      .fetchData(this.service.getLinks(this.startRage, this.endRage))
      .then(res => this.state.links = res)
      .catch(err => console.error(err));
  }

  onLaunchCreateModal() {
    this.isLinksCreate = true;
    $('#linksCreate').modal();
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
