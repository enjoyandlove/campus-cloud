import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { NOTIFY, CONTENT } from '../utils';
import { STATUS } from '../../../../../shared/constants';
import { CP_PRIVILEGES } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base/base.component';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { ErrorService, AdminService } from '../../../../../shared/services';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

declare var $: any;

@Component({
  selector: 'cp-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent extends BaseComponent implements OnInit {
  admin;
  adminId;
  loading;
  clubsMenu;
  eventsMenu;
  servicesMenu;
  isClubsModal;
  isServicesModal;
  form: FormGroup;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private adminService: AdminService,
    private errorService: ErrorService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);

    this.adminId = this.route.snapshot.params['adminId'];
    this.buildHeader();

    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.adminService.getAdminById(this.adminId))
      .then(res => {
        this.admin = res.data;
        this.buildForm();
        console.log(CONTENT.createList([17, 16]));
        console.log(this.admin);
      })
      .catch(err => console.log(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'first_name': [this.admin.firstname, Validators.required],
      'last_name': [this.admin.lastname, Validators.required],
      'email': [this.admin.email, Validators.required]
    });

    this.buildFormGroupsByPermission();
  }

  onSubmit(data) {
    console.log(data);
    console.log(this.form);
    if (!this.form.valid) {
      this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }

    // console.log(data);
  }

  toggleAllAccess(checked) {
    // 1 -> no access - 2 -> all access
    let value = checked ? 2 : 1;
    this.form.controls['clubs'].setValue(value);
    this.form.controls['events'].setValue(value);
    this.form.controls['services'].setValue(value);
  }

  onServicesSelected(service) {
    if (service.action === 2) {
      this.isServicesModal = true;
      setTimeout(() => { $('#selectServicesModal').modal(); }, 1);
      return;
    }
  }

  onCloseModal(modal): void {
    this[modal] = false;
  }

  onClubsSelected(club) {
    if (club.action === 2) {
      this.isClubsModal = true;
      setTimeout(() => { $('#selectClubsModal').modal(); }, 1);
      return;
    }
  }



  buildServicesControl(): void {
    // let group = this.fb.array([
    //   ...this.buildServicesGroup()
    // ]);

    // this.form.addControl('services', group);
    // console.log(this.buildServicesGroup());

    let control = new FormControl(1, [Validators.required]);

    this.form.addControl('services', control);
  }

  buildServicesGroup() {
    let groups = [];
    let services = [
      {
        id: 1,
        name: 'Monday',
        access: 1
      },
      {
        id: 2,
        name: 'Tuesday',
        access: 1
      }
    ];

    services.forEach(service => {
      let group = this.fb.group({
        'name': [service.name],
        'selected': [false],
        'access': []
      });
      groups.push(group);
    });

    return groups;
  }

  buildClubsControl(): void {
    let control = new FormControl(1, [Validators.required]);

    this.form.addControl('clubs', control);
  }

  buildEventsControl(): void {
    let control = new FormControl(1, [Validators.required]);

    this.form.addControl('events', control);
  }

  buildContentGroup(): void {
    let group = this.fb.group({
      'orientation': [false, Validators.required],
      'calendars': [false, Validators.required],
      'maps': [false, Validators.required],
      'feeds': [false, Validators.required],
      'links': [false, Validators.required],
      'app_customization': [false, Validators.required]
    });
    this.form.registerControl('content', group);
  }

  buildNotificationsGroup(): void {
    let group = this.fb.group({
      'campus': [false, Validators.required],
      'emergency': [false, Validators.required]
    });
    this.form.registerControl('notifications', group);
  }

  checkControl(checked, group, controlName): void {
    let control = <FormArray>this.form.controls[group];
    control.controls[controlName].setValue(checked);
  }

  buildFormGroupsByPermission() {
    /**
     * check user permissions and
     * build form groups if user has
     * access to that section
     */

    this.buildServicesControl();
    this.buildClubsControl();
    this.buildEventsControl();
    this.buildContentGroup();
    this.buildNotificationsGroup();
  }

  ngOnInit() {
    this.servicesMenu = [
      {
        'label': 'No Access',
        'action': 1
      },
      {
        'label': 'Select services',
        'action': 2
      },
      {
        'label': 'All services',
        'action': 3
      },
    ];

    this.clubsMenu = [
      {
        'label': 'No Access',
        'action': 1
      },
      {
        'label': 'Select clubs',
        'action': 2
      },
      {
        'label': 'All clubs',
        'action': 3
      },
    ];

    this.eventsMenu = [
      {
        'label': 'No access',
        'action': 1
      },
      {
        'label': 'Manage events',
        'action': 2
      },
      {
        'label': 'Manage and assess events',
        'action': 3
      }
    ];
  }
}
