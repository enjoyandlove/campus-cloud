import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { BaseComponent } from '../../base';
<<<<<<< HEAD
import { appStorage } from '../../shared/utils';
import { AdminService } from '../../shared/services';
=======
>>>>>>> 7887962c0cd34a0d05a11f9f29e4852aa1da79eb

@Component({
  selector: 'cp-controlpanel',
  styleUrls: ['./controlpanel.component.scss'],
  templateUrl: './controlpanel.component.html',
})
export class ControlPanelComponent extends BaseComponent implements OnInit {
  status;
  loading = true;

  constructor(
    private store: Store<any>,
<<<<<<< HEAD
    private service: AdminService
=======
>>>>>>> 7887962c0cd34a0d05a11f9f29e4852aa1da79eb
  ) {
    super();

    super.isLoading().subscribe(res => this.loading = res);

<<<<<<< HEAD
    if (!appStorage.get(appStorage.keys.PROFILE)) {
      this.fetch();
    }

    this.status = this.store.select('MOBILE');
  }

  private fetch() {
    super
      .fetchData(this.service.getAdmins())
      .then(res => {
        appStorage.set(appStorage.keys.PROFILE, JSON.stringify(res.data[0]));
      })
      .catch(err => console.error(err));
  }

=======
    this.status = this.store.select('MOBILE');
  }

>>>>>>> 7887962c0cd34a0d05a11f9f29e4852aa1da79eb
  ngOnInit() { }
}
