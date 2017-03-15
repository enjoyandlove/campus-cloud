import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { STATUS } from '../../../../../shared/constants';
import { ErrorService } from '../../../../../shared/services';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

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
    let value = checked ? 1 : 2;

    let clubsControl = <FormArray>this.form.controls['clubs'];
    let eventsControl = <FormArray>this.form.controls['events'];
    let serviceControl = <FormArray>this.form.controls['services'];

    clubsControl.controls['clubs'].setValue(value);
    eventsControl.controls['events'].setValue(value);
    serviceControl.controls['services'].setValue(value);
  }

  buildServicesGroup(): void {
    let group = this.fb.group({
      'services': [1, Validators.required]
    });
    this.form.registerControl('services', group);
  }

  buildClubsGroup(): void {
    let group = this.fb.group({
      'clubs': [1, Validators.required]
    });
    this.form.registerControl('clubs', group);
  }

  buildEventsGroup(): void {
    let group = this.fb.group({
      'events': [1, Validators.required]
    });
    this.form.registerControl('events', group);
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

    this.buildServicesGroup();
    this.buildClubsGroup();
    this.buildEventsGroup();
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
