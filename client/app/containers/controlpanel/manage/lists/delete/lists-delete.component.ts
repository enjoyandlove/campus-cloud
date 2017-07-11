import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';

declare var $: any;

@Component({
  selector: 'cp-lists-delete',
  templateUrl: './lists-delete.component.html',
  styleUrls: ['./lists-delete.component.scss']
})
export class ListsDeleteComponent implements OnInit {
  @Input() list: any;
  @Output() deleteList: EventEmitter<number> = new EventEmitter();

  constructor(
    private session: CPSession,
    private service: ListsService
  ) { }

  onDelete() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .removeList(this.list.id, search)
      .subscribe(
        _ => {
          $('#listsDelete').modal('hide');
          this.deleteList.emit(this.list.id);
        },
        err => console.log(err)
      );
  }

  ngOnInit() { }
}
