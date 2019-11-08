import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { baseActionClass } from '@campus-cloud/store/base';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CPI18nService, ImageService } from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-calendars-items-bulk-create-form',
  templateUrl: './calendars-items-bulk-create-form.component.html',
  styleUrls: ['./calendars-items-bulk-create-form.component.scss']
})
export class CalendarsItemsBulkCreateFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  buttonData;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    private store: Store<ISnackbar>,
    public imageService: ImageService
  ) {}

  onSubmit() {
    this.submitted.emit(this.form.value);
    this.enableSubmitButton();
  }

  onRemoveImage(index: number) {
    const eventControl = <FormArray>this.form.controls['items'];
    const control = <FormGroup>eventControl.at(index);
    control.controls['poster_url'].setValue(null);
    control.controls['poster_thumb_url'].setValue(null);
  }

  onImageUpload(image: File, index: number) {
    const promise = this.imageService.upload(image).toPromise();

    promise
      .then((res: any) => {
        const controls = <FormArray>this.form.controls['items'];
        const control = <FormGroup>controls.controls[index];
        control.controls['poster_url'].setValue(res.image_url);
        control.controls['poster_thumb_url'].setValue(res.image_url);
      })
      .catch((err) => {
        this.store.dispatch(
          new baseActionClass.SnackbarError({
            body: err ? err.message : this.cpI18n.translate('something_went_wrong')
          })
        );
      });
  }

  onResetMap(index) {
    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['location'].setValue('');
    control.controls['latitude'].setValue(0);
    control.controls['longitude'].setValue(0);
  }

  updateWithUserLocation(location, index) {
    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['location'].setValue(location.name);
    control.controls['latitude'].setValue(location.latitude);
    control.controls['longitude'].setValue(location.longitude);
  }

  onPlaceChange(placeData, index) {
    if (!placeData) {
      return;
    }

    if ('fromUsersLocations' in placeData) {
      this.updateWithUserLocation(placeData, index);

      return;
    }

    const coords: google.maps.LatLngLiteral = placeData.geometry.location.toJSON();

    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['latitude'].setValue(coords.lat);
    control.controls['longitude'].setValue(coords.lng);

    control.controls['location'].setValue(placeData.name);
  }

  enableSubmitButton() {
    this.buttonData = { ...this.buttonData, disabled: false };
  }

  ngOnInit() {
    this.buttonData = {
      text: 'Import Items',
      class: 'primary',
      disabled: true
    };

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((_) => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
