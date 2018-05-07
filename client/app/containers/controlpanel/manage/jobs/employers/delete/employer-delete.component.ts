import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { EmployerService } from '../employer.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-employer-delete',
  templateUrl: './employer-delete.component.html',
  styleUrls: ['./employer-delete.component.scss']
})
export class EmployerDeleteComponent implements OnInit {
  @Input() employer;

  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EmployerService
  ) {}

  onDelete() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteEmployer(this.employer.id, search).subscribe(() => {
      this.deleted.emit(this.employer.id);
      this.resetDeleteModal.emit();
      $('#deleteModal').modal('hide');
    });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
