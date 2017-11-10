import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ClubsService } from '../clubs.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-clubs-delete',
  templateUrl: './clubs-delete.component.html',
  styleUrls: ['./clubs-delete.component.scss']
})
export class ClubsDeleteComponent implements OnInit {
  @Input() club: any;
  @Output() deletedClub: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(
    private service: ClubsService,
    private cpI18n: CPI18nService,
  ) { }

  onDelete() {
    this
      .service
      .deleteClubById(this.club.id)
      .subscribe(
        _ => {
          this.deletedClub.emit(this.club.id);

          $('#deleteClubsModal').modal('hide');

          this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
        },
        () => this.buttonData = Object.assign({}, this.buttonData, { disabled: false })
      );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    }
  }
}
