import { SectionUtilsService } from './../section.utils.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CPSession } from './../../../../../../session';
import { ICampusGuide } from './../section.interface';
import { SectionsService } from './../sections.service';
import { CPI18nService } from '../../../../../../shared/services';

@Component({
  selector: 'cp-personas-section-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class PersonasSectioDeleteComponent implements OnInit {
  @Input() section: ICampusGuide;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<ICampusGuide> = new EventEmitter();
  @Output() error: EventEmitter<HttpErrorResponse> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: SectionsService,
    public utils: SectionUtilsService
  ) {}

  onDelete() {
    if (this.utils.isTemporaryGuide(this.section)) {
      this.deleted.emit(this.section);
      this.teardown.emit();

      return;
    }

    const search = new HttpParams().set('school_id', this.session.g.get('school').id);

    this.service.deleteSectionTileCategory(this.section.id, search).subscribe(
      () => {
        this.deleted.emit(this.section);
        this.teardown.emit();
      },
      (err) => {
        this.error.emit(err);
        this.teardown.emit();
      }
    );
  }

  ngOnInit(): void {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
