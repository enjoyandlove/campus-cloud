import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { TemplatesService } from './../templates.service';
import { CPSession } from './../../../../../session/index';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

declare var $;

@Component({
  selector: 'cp-templates-delete',
  templateUrl: './templates-delete.component.html',
  styleUrls: ['./templates-delete.component.scss'],
})
export class TemplatesDeleteComponent implements OnInit {
  @Input() item: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isError;
  buttonData;
  errorMessage;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: TemplatesService,
  ) {}

  doReset() {
    this.isError = false;
    this.teardown.emit();
  }

  onDelete() {
    this.isError = false;
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteTemplate(search, this.item.id).subscribe(
      (_) => {
        this.teardown.emit();
        this.deleted.emit(this.item.id);
        $('#deleteTemplateModal').modal('hide');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: true,
        });
      },
      (_) => {
        this.isError = true;
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: true,
        });
      },
    );
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete'),
    };
  }
}