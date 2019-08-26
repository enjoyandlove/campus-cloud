import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { baseActions } from '@campus-cloud/store/base/reducers';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { getClubsState, baseActionClass } from '@campus-cloud/store';
import { CPI18nService, ImageService } from '@campus-cloud/shared/services';
import { isClubAthletic, clubAthleticLabels } from '../clubs.athletics.labels';

@Component({
  selector: 'cp-clubs-excel',
  templateUrl: './clubs-excel.component.html',
  styleUrls: ['./clubs-excel.component.scss']
})
export class ClubsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() isAthletic = isClubAthletic.club;

  clubs;
  labels;
  formError;
  buttonData;
  form: FormGroup;
  isFormReady = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private i18nPipe: CPI18nPipe,
    private cpI18n: CPI18nService,
    private clubService: ClubsService,
    private imageService: ImageService
  ) {
    super();
    this.store
      .select(getClubsState)
      .pipe(take(1))
      .subscribe((res) => {
        this.clubs = res;
      });
  }

  onRemoveImage(index) {
    const clubsControl = <FormArray>this.form.controls['clubs'];
    const control = <FormGroup>clubsControl.at(index);
    control.controls['logo_url'].setValue(null);
  }

  private buildHeader() {
    const subheading = this.i18nPipe.transform(this.labels.import_items, this.clubs.length);
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: this.labels.import_heading,
        crumbs: {
          url: this.labels.club_athletic,
          label: this.labels.club_athletic
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: []
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      clubs: this.fb.array([])
    });

    this.buildGroup();
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['clubs'];

    this.clubs.forEach((club) => {
      control.push(this.buildClubControl(club));
    });

    this.isFormReady = true;
  }

  buildClubControl(club) {
    return this.fb.group({
      name: [club.club_name, Validators.required],
      logo_url: [null, Validators.required],
      status: [0],
      has_membership: [true],
      email: [club.email],
      description: [club.description],
      phone: [club.phone_number],
      website: [club.website],
      category_id: [this.isAthletic]
    });
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.CLUBS_MODAL_RESET });
    this.store.dispatch({ type: baseActions.HEADER_DEFAULT });
  }

  onImageUpload(image, index) {
    const promise = this.imageService.upload(image).toPromise();

    promise
      .then((res: any) => {
        const clubsControl = <FormArray>this.form.controls['clubs'];
        const control = <FormGroup>clubsControl.at(index);
        control.controls['logo_url'].setValue(res.image_url);
      })
      .catch((err) => {
        this.handleError(err.message);
      });
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;

      return;
    }

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.clubService.createClub(this.form.value.clubs, search).subscribe(
      (_) => this.router.navigate(['/manage/' + this.labels.club_athletic]),
      () => {
        this.handleError();
      }
    );
  }

  handleError(err?: string) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: err ? err : this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  ngOnInit() {
    this.labels = clubAthleticLabels(this.isAthletic);
    this.buildHeader();
    this.buildForm();
    this.buttonData = {
      text: this.cpI18n.translate(this.labels.import_button),
      class: 'primary',
      disabled: true
    };

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }
}
