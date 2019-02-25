import { Input, EventEmitter, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { IDining } from '@libs/locations/common/model';

@Component({
  selector: 'cp-dining-delete',
  templateUrl: './dining-delete.component.html',
  styleUrls: ['./dining-delete.component.scss']
})
export class DiningDeleteComponent implements OnInit {
  @Input() dining: IDining;

  @Output() teardown: EventEmitter<null> = new EventEmitter();

  constructor(
    public session: CPSession,
    public store: Store<fromStore.IDiningState>) {}

  onDelete() {
    const diningId = this.dining.id;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().set('school_id', school_id);

    const payload = {
      params,
      diningId
    };

    this.store.dispatch(new fromStore.DeleteDining(payload));
    this.resetModal();
  }

  resetModal() {
    this.teardown.emit();
    $('#diningDelete').modal('hide');
  }

  ngOnInit(): void {}
}
