import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TOGGLE } from '../../../reducers/mobile.reducer';

@Component({
  selector: 'cp-hamburger',
  templateUrl: './cp-hamburger.component.html',
  styleUrls: ['./cp-hamburger.component.scss']
})
export class CPHamburgerComponent implements OnInit {
  status;

  constructor(private store: Store<any>) {
    this.status = this.store.select('MOBILE');
  }

  toggleMenu() {
    this.store.dispatch({ type: TOGGLE });
  }

  ngOnInit() { }
}
