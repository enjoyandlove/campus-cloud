import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LinksService } from '../links.service';
import { ErrorService } from '../../../../../shared/services/error.service';

declare var $: any;

@Component({
  selector: 'cp-links-delete',
  templateUrl: './links-delete.component.html',
  styleUrls: ['./links-delete.component.scss']
})
export class LinksDeleteComponent implements OnInit {
  @Input() link: any;
  @Output() deleteLink: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  constructor(
    private service: LinksService,
    private errorService: ErrorService
  ) { }

  onDelete() {
    this
      .service
      .deleteLink(this.link.id)
      .subscribe(
        _ => {
          $('#linksDelete').modal('hide');
          this.deleteLink.emit(this.link.id);
          this.resetModal();
        },
        err => this.errorService.handleError(err)
      );
  }

  resetModal() {
    this.resetDeleteModal.emit();
  }

  ngOnInit() { }
}
