import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrientationService } from './../orientation.services';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-orientation-program-delete',
  templateUrl: './orientation-program-delete.component.html',
  styleUrls: ['./orientation-program-delete.component.scss'],
})
export class OrientationProgramDeleteComponent implements OnInit {
  @Input() orientationProgram;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: OrientationService,
  ) {}

  onDelete() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service
      .deleteOrientationProgram(this.orientationProgram.id, search)
      .subscribe(() => {
        this.deleted.emit(this.orientationProgram.id);

        $('#programDelete').modal('hide');

        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false,
        });
      });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger',
    };
  }
}
