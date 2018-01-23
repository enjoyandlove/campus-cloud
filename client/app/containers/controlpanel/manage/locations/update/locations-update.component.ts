import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';

import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { LocationsService } from '../locations.service';

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss'],
})
export class LocationsUpdateComponent implements OnInit {
  @Input() location: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() locationUpdated: EventEmitter<any> = new EventEmitter();

  school;
  form: FormGroup;
  isFormReady = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  constructor(
    public el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    public service: LocationsService,
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  onResetMap() {
    CPMap.setFormLocationData(
      this.form,
      CPMap.resetLocationFields(this.school),
    );
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  doSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .updateLocation(this.form.value, this.location.id, search)
      .subscribe((_) => {
        $('#locationsUpdate').modal('hide');
        this.locationUpdated.emit({
          id: this.location.id,
          data: this.form.value,
        });
        this.resetModal();
      });
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);

      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.name };

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  resetModal() {
    this.teardown.emit();
  }

  ngOnInit() {
    this.school = this.session.g.get('school');

    this.mapCenter = new BehaviorSubject({
      lat: this.location.latitude,
      lng: this.location.longitude,
    });

    this.form = this.fb.group({
      name: [this.location.name, Validators.required],
      short_name: [this.location.short_name, Validators.maxLength(32)],
      address: [this.location.address, Validators.required],
      city: [this.location.city],
      province: [this.location.province],
      country: [this.location.country],
      postal_code: [this.location.postal_code],
      latitude: [this.location.latitude, Validators.required],
      longitude: [this.location.longitude, Validators.required],
    });

    this.isFormReady = true;
  }
}
