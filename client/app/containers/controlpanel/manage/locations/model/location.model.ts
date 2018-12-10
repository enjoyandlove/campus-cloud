import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LocationModel {
  public readonly id;
  public url: string;
  public city: string;
  public name: string;
  public phone: string;
  public label: string;
  public email: string;
  public country: string;
  public address: string;
  public province: string;
  public latitude: number;
  public longitude: string;
  public short_name: string;
  public description: string;
  public postal_code: string;
  public thumbnail_url: string;
  public location_type: number;

  _form: FormGroup;

  get form(): FormGroup {
    return this._form ? this._form : this.buildForm();
  }

  constructor({ ...location } = {}) {
    const url = location['links'] ? location['links'][0]['url'] : null;
    const label = location['links'] ? location['links'][0]['label'] : null;

    this.url = url;
    this.label = label;
    this.id = location['id'] || null;
    this.city = location['city'] || null;
    this.name = location['name'] || null;
    this.phone = location['phone'] || null;
    this.email = location['email'] || null;
    this.country = location['country'] || null;
    this.address = location['address'] || null;
    this.province = location['province'] || null;
    this.latitude = location['latitude'] || null;
    this.longitude = location['longitude'] || null;
    this.short_name = location['short_name'] || null;
    this.description = location['description'] || null;
    this.postal_code = location['postal_code'] || null;
    this.location_type = location['location_type'] || null;
    this.thumbnail_url = location['thumbnail_url'] || null;

    this.buildSchedule(location['schedule']);
  }

  private buildForm(): FormGroup {
    const fb = new FormBuilder();

    this._form = fb.group({
      city: [this.city],
      phone: [this.phone],
      email: [this.email],
      country: [this.country],
      address: [this.address],
      province: [this.province],
      short_name: [this.short_name],
      postal_code: [this.postal_code],
      description: [this.description],
      thumbnail_url: [this.thumbnail_url],
      name: [this.name, Validators.required],
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
      location_type: [this.location_type, Validators.required],
      links: fb.array([
        fb.group({
          url: [this.url],
          label: [this.label]
        })
      ]),
      schedule: fb.array([])
    });

    return this._form;
  }

  buildSchedule(schedule) {
    if (schedule) {
      const scheduleControls = <FormArray>this.form.controls['schedule'];

      schedule.map((items) => {
        scheduleControls.push(this.buildScheduleForm(items));
      });
    }
  }

  buildScheduleForm(schedule) {
    const fb = new FormBuilder();

    return fb.group({
      day: schedule.day,
      items: this.buildScheduleFormItems(schedule.items)
    });
  }

  buildScheduleFormItems(items) {
    const fb = new FormBuilder();

    const itemsList =  items.map((item) => {
      return fb.group({
        open: item.open,
        close: item.close,
        link: item.link,
        notes: item.notes
      });
    });

    return fb.array(itemsList);
  }
}
