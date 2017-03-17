import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { STATUS } from '../../../../../shared/constants';
import { ErrorService } from '../../../../../shared/services';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

declare var $: any;

@Component({
  selector: 'cp-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  clubsMenu;
  eventsMenu;
  servicesMenu;
  form: FormGroup;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private errorService: ErrorService
  ) { }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email': ['', Validators.required]
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
      // $('#selectServicesModal').modal();
      $('#selectClubsModal').modal();
      return;
    }
    // console.log(service);
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
    this.buildHeader();
    this.buildForm();

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
