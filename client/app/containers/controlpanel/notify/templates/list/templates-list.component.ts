import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { TemplatesService } from './../templates.service';
import { CPSession } from './../../../../../session/index';
import { BaseComponent } from './../../../../../base/base.component';

interface IState {
  search_str: string;
  templates: Array<any>;
}

declare var $;

@Component({
  selector: 'cp-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})

export class TemplatesListComponent extends BaseComponent implements OnInit {
  loading;

  deleteTemplate;
  templateData;

  isTemplateDelete;

  isTemplateCreateModal = false;
  isTemplateComposeModal = false;

  state: IState = {
    search_str: null,
    templates: []
  }

  constructor(
    private session: CPSession,
    private service: TemplatesService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  fetch() {
    let search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('school_id', this.session.school.id.toString());

    const stream$ = this.service.getTemplates(this.startRange, this.endRange, search);

    super
      .fetchData(stream$)
      .then(res => {
        this.state = Object.assign(
          {},
          this.state,
          { templates: res.data }
        )
      })
      .catch(err => {
        console.log(err);
      })
  }

  onFilter(search_str) {
    this.state = Object.assign({}, this.state, { search_str });
    this.fetch();
  }

  onDeleted(id) {
    this.state = Object.assign(
      {},
      this.state,
      {
        templates: this.state.templates.filter(template => template.id !== id)
      }
    );
  }

  onLauncDeleteModal(template) {
    this.isTemplateDelete = true;
    this.deleteTemplate = template;

    setTimeout(() => { $('#deleteTemplateModal').modal(); }, 1);
  }

  onCreated() {
    this.fetch();
    $('#templateComposeModal').modal('hide');
  }

  onLaunchCreateModal() {
    this.isTemplateCreateModal = true;
    setTimeout(() => { $('#templateCreateModal').modal(); }, 1);
  }

  onLaunchComposeModal(templateData) {
    this.isTemplateComposeModal = true;
    this.templateData = templateData;
    setTimeout(() => { $('#templateComposeModal').modal(); }, 1);
  }

  ngOnInit() {
    this.fetch();
  }
}
