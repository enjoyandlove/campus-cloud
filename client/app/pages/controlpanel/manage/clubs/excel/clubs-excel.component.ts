import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

// import { ClubsService } from '../clubs.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CLUBS_MODAL_RESET } from '../../../../../reducers/clubs.reducer';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-excel',
  templateUrl: './clubs-excel.component.html',
  styleUrls: ['./clubs-excel.component.scss']
})
export class ClubsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  clubs;
  form: FormGroup;
  isFormReady = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    // private clubService: ClubsService
  ) {
    super();
    this
      .store
      .select('CLUBS')
      .subscribe(
        (_) => {
          // this.clubs = res;
          this.clubs = require('./mock.json');
          this.buildHeader();
          this.buildForm();
          console.log(this.clubs);
          // this.fetch();
        }
    );
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Clubs',
        'em': `${this.clubs.length} valid student club(s) in the file`,
        'children': []
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'clubs': this.fb.array([])
    });

    this.buildGroup();
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['clubs'];

    this.clubs.forEach(club => {
      control.push(this.buildClubControl(club));
    });

    this.isFormReady = true;
  }

  buildClubControl(club) {
    return this.fb.group({
      'name': [club.club_name, Validators.required],
      'logo_url': [null, Validators.required],
      'status': [0],
      'has_membership': [true],
      'email': [club.email],
      'description': [club.description],
      'phone': [club.phone],
      'website': [club.website],
    });
  }

  ngOnDestroy() {
    this.store.dispatch({ type: CLUBS_MODAL_RESET });
    this.store.dispatch({ type: HEADER_DEFAULT });
  }

  onSubmit() {
    console.log(this.form.value);
  }

  ngOnInit() { }
}
