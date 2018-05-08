import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { TemplatesService } from './../templates.service';
import { CPSession } from './../../../../../session/index';
import { base64 } from './../../../../../shared/utils/encrypt';
import { BaseComponent } from './../../../../../base/base.component';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

interface IState {
  search_str: string;
  templates: Array<any>;
  sort_field: string;
  sort_direction: string;
}

@Component({
  selector: 'cp-templates-list',
  templateUrl: './templates-list.component.html',
  styleUrls: ['./templates-list.component.scss']
})
export class TemplatesListComponent extends BaseComponent implements OnInit {
  loading;

  schoolId;
  templateId;

  deleteTemplate;
  templateData;

  isTemplateDelete;

  isTemplateCreateModal = false;
  isTemplateComposeModal = false;

  state: IState = {
    search_str: null,
    templates: [],
    sort_field: 'name',
    sort_direction: 'asc'
  };

  constructor(
    private router: Router,
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
    private service: TemplatesService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));

    this.templateId = this.route.snapshot.queryParams['template'];
    this.schoolId = this.route.snapshot.queryParams['school'];
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  fetch() {
    const search = new HttpParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getTemplates(this.startRange, this.endRange, search);

    super.fetchData(stream$).then((res) => {
      this.state = Object.assign({}, this.state, { templates: res.data });
    });
  }

  onFilter(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  onDeleted(id) {
    this.state = Object.assign({}, this.state, {
      templates: this.state.templates.filter((template) => template.id !== id)
    });

    if (this.state.templates.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  onLauncDeleteModal(template) {
    this.isTemplateDelete = true;
    this.deleteTemplate = template;

    setTimeout(
      () => {
        $('#deleteTemplateModal').modal();
      },

      1
    );
  }

  onComposed() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('announcement_success_sent'),
        autoClose: true
      }
    });

    $('#templateComposeModal').modal('hide');
  }
  onCreated() {
    this.fetch();

    $('#templateCreateModal').modal('hide');
  }

  onLaunchCreateModal() {
    this.isTemplateCreateModal = true;
    setTimeout(
      () => {
        $('#templateCreateModal').modal();
      },

      1
    );
  }

  updateURL(template) {
    this.router.navigate(['/notify/templates'], {
      queryParams: {
        template: base64.encode(template.id.toString()),
        school: base64.encode(this.session.g.get('school').id.toString())
      }
    });
  }
  doComposeModalTeardown() {
    this.isTemplateComposeModal = false;

    this.router.navigate(['/notify/templates']);
  }

  onLaunchComposeModal(templateData) {
    this.updateURL(templateData);

    this.isTemplateComposeModal = true;
    this.templateData = templateData;

    setTimeout(
      () => {
        $('#templateComposeModal').modal();
      },

      1
    );
  }

  loadTemplateFromId() {
    const search = new HttpParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service
      .getTemplateById(search, +base64.decode(this.templateId))
      .toPromise()
      .then((template) => {
        this.isTemplateComposeModal = true;

        this.templateData = template;
        setTimeout(
          () => {
            $('#templateComposeModal').modal();
          },

          1
        );
      })
      .catch((_) => null);
  }

  ngOnInit() {
    this.fetch();

    if (this.templateId && this.schoolId) {
      this.loadTemplateFromId();
    }
  }
}
