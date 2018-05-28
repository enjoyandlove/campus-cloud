import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { URLSearchParams } from '@angular/http';

import { AudienceService } from '../audience.service';
import { CPSession } from '../../../../session';
import { CPI18nService } from '../../../../shared/services/index';

const AUDIENCE_USED_IN_TEMPLATE = 409;

@Component({
  selector: 'cp-audience-delete',
  templateUrl: './audience-delete.component.html',
  styleUrls: ['./audience-delete.component.scss']
})
export class AudienceDeleteComponent implements OnInit {
  @Input() audience: any;
  @Output() deleteAudience: EventEmitter<number> = new EventEmitter();

  buttonData;
  templateConflict = false;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: AudienceService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.templateConflict = false;

    $('#audienceDeleteModal').modal('hide');
  }

  onDelete() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteAudience(this.audience.id, search).subscribe(
      (_) => {
        $('#audienceDeleteModal').modal('hide');
        this.deleteAudience.emit(this.audience.id);
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      },
      (err) => {
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });

        if (err.status === AUDIENCE_USED_IN_TEMPLATE) {
          this.templateConflict = true;

          return;
        }
      }
    );
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };
  }
}
