import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { HEADER_UPDATE, IHeader } from '../../../reducers/header.reducer';


@Component({
    selector: 'cp-team',
    template: `
        <cp-page-header [data]="headerData$ | async"></cp-page-header>
        <div class="cp-wrapper cp-wrapper--outer">
            <router-outlet></router-outlet>
        </div>
    `,
})
export class SettingsComponent implements OnInit {

    headerData$: Observable<IHeader>;

    constructor(private store: Store<any>) {
        this.headerData$ = this.store.select('HEADER');

        this.store.dispatch({
            type: HEADER_UPDATE,
            payload: require('./settings.header.json')
        });
    }

    ngOnInit() {}
}
