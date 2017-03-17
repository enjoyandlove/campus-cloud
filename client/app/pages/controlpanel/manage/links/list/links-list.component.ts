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
  // links;
  endRage = 20;
  editLink = '';
  startRage = 1;
  pageNumber = 1;
  loading = true;
  deleteLink = '';
  resultsPerPage = 20;
  state: IState = state;

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

  doFilter(query) {
    console.log(`Searching for ${query}`);
  }

  private fetch() {
    super
      .fetchData(this.service.getLinks(this.startRage, this.endRage))
      .then(res => this.state.links = res)
      .catch(err => console.error(err));
  }

  onLaunchCreateModal() {
    $('#linksCreate').modal();
  }

  onCreatedLink(link: ILink) {
    this.state.links = [link, ...this.state.links];
  }

  onEditedLink(editedLink) {
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
    let _state = Object.assign({}, this.state);

    _state.links = _state.links.filter(link => {
      if (link.id !== linkId) { return link; }

      return;
    });

    this.state = Object.assign({}, this.state, { links: _state.links });
  }

  ngOnInit() { }
}
