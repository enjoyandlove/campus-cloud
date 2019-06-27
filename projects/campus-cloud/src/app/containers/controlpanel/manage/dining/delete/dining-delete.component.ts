import { Input, EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@campus-cloud/session';
import { IDining } from '@campus-cloud/libs/locations/common/model';

@Component({
  selector: 'cp-dining-delete',
  templateUrl: './dining-delete.component.html',
  styleUrls: ['./dining-delete.component.scss']
})
export class DiningDeleteComponent implements OnInit {
  @Input() dining: IDining;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  constructor(public session: CPSession, public store: Store<fromStore.IDiningState>) {}

  onDelete() {
    this.store.dispatch(new fromStore.DeleteDining(this.dining));
    this.resetModal();
  }

  resetModal() {
    this.teardown.emit();
    $('#diningDelete').modal('hide');
  }

  ngOnInit(): void {}
}
