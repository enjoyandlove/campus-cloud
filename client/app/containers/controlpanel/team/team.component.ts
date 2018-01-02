import { Component, OnInit } from '@angular/core';
import { ManageHeaderService } from '../manage/utils/header';
import { IUser } from '../../../session';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { HEADER_UPDATE, IHeader } from '../../../reducers/header.reducer';


@Component({
    selector: 'cp-team',
    templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit {

    user: IUser;
    headerData$: Observable<IHeader>;

    constructor(private router: Router,
                private store: Store<any>,
                private headerService: ManageHeaderService) {
        this.headerData$ = this.store.select('HEADER');
    }

    ngOnInit() {
        if (this.router.url.split('/').includes('facebook')) {
            /**
             * we want to prevent updating the header when on /import/facebook
             */
            return;
        }

        this.store.dispatch({
            type: HEADER_UPDATE,
            payload: this.headerService.filterByPrivileges()
        });
    }
}
