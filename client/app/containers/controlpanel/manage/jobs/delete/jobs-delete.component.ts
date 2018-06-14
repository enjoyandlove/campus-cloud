import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { JobsService } from '../jobs.service';
import { CPSession } from './../../../../../session';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-jobs-delete',
  templateUrl: './jobs-delete.component.html',
  styleUrls: ['./jobs-delete.component.scss']
})
export class JobsDeleteComponent implements OnInit {
  @Input() job;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: JobsService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteJob(this.job.id, search).subscribe(() => {
      this.deleted.emit(this.job.id);
      this.resetDeleteModal.emit();
      $('#deleteJobModal').modal('hide');
    });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
