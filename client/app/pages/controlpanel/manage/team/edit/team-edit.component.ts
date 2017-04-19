// import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Store } from '@ngrx/store';

// // import { NOTIFY, CONTENT } from '../utils';
// import { TEAM_ACCESS } from '../utils';
// import { STATUS } from '../../../../../shared/constants';
// import { BaseComponent } from '../../../../../base/base.component';
// import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
// import { CP_PRIVILEGES, appStorage } from '../../../../../shared/utils';
// import { ErrorService, AdminService } from '../../../../../shared/services';
// import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

// declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
// import { STATUS } from '../../../../../shared/constants';
import { BaseComponent } from '../../../../../base/base.component';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { CP_PRIVILEGES, appStorage } from '../../../../../shared/utils';
import { AdminService } from '../../../../../shared/services';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

declare var $: any;

@Component({
  selector: 'cp-team-edit',
  templateUrl: './team-edit.component.html',
  // template: '',
  styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent extends BaseComponent implements OnInit {
  user;
  adminId;
  loading;
  formData;
  schoolId;
  formError;
  clubsMenu;
  eventsMenu;
  privileges;
  isFormError;
  manageAdmins;
  servicesMenu;
  form: FormGroup;
  isAllAccessEnabled;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES = CP_PRIVILEGES;

  constructor(
    // private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private adminService: AdminService,
    // private errorService: ErrorService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.adminId = this.route.snapshot.params['adminId'];

    this.fetch();
  }

  private fetch() {
    const _ = require('lodash');
    const admin$ = this.adminService.getAdminById(this.adminId);

    super
      .fetchData(admin$)
      .then(res => {

        this.buildForm(res.data);
        this.privileges = Object.assign(
          {},
          res.data.school_level_privileges[this.schoolId]
        );
        console.log(this.formData);
        console.log(this.privileges);
        this.isAllAccessEnabled = _.isEqual(this.privileges,
                                     this.user.school_level_privileges[this.schoolId]);
      })
      .catch(err => console.log(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../team.header.json')
    });
  }

  private buildForm(profile) {
    this.form = this.fb.group({
      'firstname': [profile.firstname, Validators.required],
      'lastname': [profile.lastname, Validators.required],
      'email': [profile.email, Validators.required]
    });
  }

  onSubmit(data) {
    console.log(data);
    console.log(this.privileges);
    // this.formError = null;
    // this.isFormError = false;

    // if (!this.form.valid) {
    //   this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
    //   return;
    // }

    // let _data = {
    //   ...data,
    //   school_level_privileges: {
    //     [this.schoolId]: {
    //       ...this.privileges
    //     }
    //   }
    // };

    // this
    //   .adminService
    //   .createAdmin(_data)
    //   .subscribe(
    //     _ => this.router.navigate['/manage/team'],
    //     err => {
    //       this.isFormError = true;

    //       if (err.status === 409) {
    //         this.formError = STATUS.DUPLICATE_ENTRY;
    //         return;
    //       }

    //       this.formError = 'Something went wrong';
    //     }
    //   );
  }

  onManageAdminSelected(data) {
    if (!data.action) {
      delete this.privileges[10];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        10: {
          r: true,
          w: true
        }
      }
    );
  }

  toggleAllAccess(checked) {
   if (checked) {
     this.privileges = Object.assign({}, this.user.school_level_privileges[this.schoolId]);
     return;
   }
   this.privileges = {};
  }

  onServicesModalSelected(services) {
    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        24: {...services}
      }
    );
  }

  onServicesSelected(service) {
    if (service.action === 2) {
      $('#selectServicesModal').modal();
      return;
    }

    if (service.action === null) {
      delete this.privileges[24];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        24 : {
          r: service.action === 2 ? true : true,
          w: service.action === 2 ? false : true
        }
      }
    );
  }

  onClubsModalSelected(clubs) {
    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        22: {...clubs}
      }
    );
  }

  onClubsSelected(club) {
    if (club.action === 2) {
      $('#selectClubsModal').modal();
      return;
    }

    if (club.action === null) {
      delete this.privileges[22];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        22 : {
          r: club.action === 2 ? true : true,
          w: club.action === 2 ? false : true
        }
      }
    );
  }

  onEventsSelected(event) {
    if (event.action === null) {
      delete this.privileges[18];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        18 : {
          r: event.action === 2 ? true : true,
          w: event.action === 2 ? false : true
        }
      }
    );
  }


  checkControl(checked, type): void {

    if (this.privileges && this.privileges[type]) {
      delete this.privileges[type];
      return;
    }

    this.privileges = Object.assign(
      {},
      this.privileges,
      {
        [type]: {
          r: checked,
          w: checked
        }
      });
  }

  ngOnInit() {
    this.schoolId = 157;
    this.user = JSON.parse(appStorage.get(appStorage.keys.PROFILE));
    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();

    this.servicesMenu = [
      {
        'label': 'No Access',
        'action': null
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

    this.manageAdmins = [
     {
        'label': 'Disabled',
        'action': null
     },
     {
        'label': 'Enabled',
        'action': 1
     }
    ];

    this.clubsMenu = [
      {
        'label': 'No Access',
        'action': null
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
        'action': null
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

//   user;
//   profile;
//   adminId;
//   loading;
//   formData;
//   schoolId;
//   formError;
//   clubsMenu;
//   eventsMenu;
//   privileges;
//   isFormError;
//   manageAdmins;
//   servicesMenu;
//   isClubsModal;
//   isServicesModal;
//   form: FormGroup;
//   isAllAccessEnabled;
//   MODAL_TYPE = MODAL_TYPE.WIDE;
//   CP_PRIVILEGES = CP_PRIVILEGES;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private store: Store<IHeader>,
//     private adminService: AdminService,
//     private errorService: ErrorService
//   ) {
//     super();
//     super.isLoading().subscribe(res => this.loading = res);

//     this.adminId = this.route.snapshot.params['adminId'];
//     this.buildHeader();

//     this.fetch();
//   }

  // private fetch() {
  //   const admin$ = this.adminService.getAdminById(this.adminId);

  //   super
  //     .fetchData(admin$)
  //     .then(res => {
  //       this.profile = res.data;

  //       this.buildForm();
  //     })
  //     .catch(err => console.log(err));
  // }


//   private buildHeader() {
//     this.store.dispatch({
//       type: HEADER_UPDATE,
//       payload: require('../team.header.json')
//     });
//   }

//   private buildForm() {
//     this.form = this.fb.group({
//       'first_name': [this.profile.firstname, Validators.required],
//       'last_name': [this.profile.lastname, Validators.required],
//       'email': [this.profile.email, Validators.required]
//     });

//     this.buildFormGroupsByPermission();
//   }

//   onSubmit(data) {
//     console.log(data);
//     if (!this.form.valid) {
//       this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
//       return;
//     }
//   }

//   toggleAllAccess(checked) {
//     // 1 -> no access - 2 -> all access
//     let value = checked ? 2 : 1;
//     this.form.controls['clubs'].setValue(value);
//     this.form.controls['events'].setValue(value);
//     this.form.controls['services'].setValue(value);
//   }

//   onServicesSelected(service) {
//     if (service.action === 2) {
//       this.isServicesModal = true;
//       setTimeout(() => { $('#selectServicesModal').modal(); }, 1);
//       return;
//     }
//   }

//   onCloseModal(modal): void {
//     this[modal] = false;
//   }

//   onClubsSelected(club) {
//     if (club.action === 2) {
//       this.isClubsModal = true;
//       setTimeout(() => { $('#selectClubsModal').modal(); }, 1);
//       return;
//     }
//   }



//   buildServicesControl(): void {
//     // let group = this.fb.array([
//     //   ...this.buildServicesGroup()
//     // ]);

//     // this.form.addControl('services', group);
//     // console.log(this.buildServicesGroup());

//     let control = new FormControl(1, [Validators.required]);

//     this.form.addControl('services', control);
//   }

//   buildServicesGroup() {
//     let groups = [];
//     let services = [
//       {
//         id: 1,
//         name: 'Monday',
//         access: 1
//       },
//       {
//         id: 2,
//         name: 'Tuesday',
//         access: 1
//       }
//     ];

//     services.forEach(service => {
//       let group = this.fb.group({
//         'name': [service.name],
//         'selected': [false],
//         'access': []
//       });
//       groups.push(group);
//     });

//     return groups;
//   }

//   buildClubsControl(): void {
//     let control = new FormControl(1, [Validators.required]);

//     this.form.addControl('clubs', control);
//   }

//   buildEventsControl(): void {
//     let control = new FormControl(1, [Validators.required]);

//     this.form.addControl('events', control);
//   }

//   buildContentGroup(): void {
//     let group = this.fb.group({
//       'orientation': [false, Validators.required],
//       'calendars': [false, Validators.required],
//       'maps': [false, Validators.required],
//       'feeds': [false, Validators.required],
//       'links': [false, Validators.required],
//       'app_customization': [false, Validators.required]
//     });
//     this.form.registerControl('content', group);
//   }

//   buildNotificationsGroup(): void {
//     let group = this.fb.group({
//       'campus': [false, Validators.required],
//       'emergency': [false, Validators.required]
//     });
//     this.form.registerControl('notifications', group);
//   }

//   checkControl(checked, group, controlName): void {
//     let control = <FormArray>this.form.controls[group];
//     control.controls[controlName].setValue(checked);
//   }

//   buildFormGroupsByPermission() {
//     /**
//      * check user permissions and
//      * build form groups if user has
//      * access to that section
//      */

//     this.buildServicesControl();
//     this.buildClubsControl();
//     this.buildEventsControl();
//     this.buildContentGroup();
//     this.buildNotificationsGroup();
//   }

//   ngOnInit() {
//     this.schoolId = 157;
//     this.user = JSON.parse(appStorage.get(appStorage.keys.PROFILE));
//     this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

//     this.buildHeader();

//     this.servicesMenu = [
//       {
//         'label': 'No Access',
//         'action': null
//       },
//       {
//         'label': 'Select services',
//         'action': 2
//       },
//       {
//         'label': 'All services',
//         'action': 3
//       },
//     ];

//     this.manageAdmins = [
//      {
//         'label': 'Disabled',
//         'action': null
//      },
//      {
//         'label': 'Enabled',
//         'action': 1
//      }
//     ];

//     this.clubsMenu = [
//       {
//         'label': 'No Access',
//         'action': null
//       },
//       {
//         'label': 'Select clubs',
//         'action': 2
//       },
//       {
//         'label': 'All clubs',
//         'action': 3
//       },
//     ];

//     this.eventsMenu = [
//       {
//         'label': 'No access',
//         'action': null
//       },
//       {
//         'label': 'Manage events',
//         'action': 2
//       },
//       {
//         'label': 'Manage and assess events',
//         'action': 3
//       }
//     ];
//   }
// }
