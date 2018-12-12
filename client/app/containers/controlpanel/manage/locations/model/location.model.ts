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
  public image_url: string;
  public short_name: string;
  public description: string;
  public postal_code: string;
  public category_id: number;

  _form: FormGroup;

  get form(): FormGroup {
    return this._form ? this._form : this.buildForm();
  }

  constructor({ ...location } = {}) {
    this.setLinks(location['links']);

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
    this.image_url = location['image_url'] || null;
    this.short_name = location['short_name'] || null;
    this.description = location['description'] || null;
    this.postal_code = location['postal_code'] || null;
    this.category_id = location['category_id'] || null;

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
      image_url: [this.image_url],
      short_name: [this.short_name],
      postal_code: [this.postal_code],
      description: [this.description],
      name: [this.name, Validators.required],
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
      category_id: [this.category_id, Validators.required],
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
        link: item.link,
        notes: item.notes,
        end_time: item.end_time,
        start_time: item.start_time
      });
    });

    return fb.array(itemsList);
  }

  setLinks(links) {
    if (links) {
      links.map((link) => {
        this.url = link.url ? link.url : null;
        this.label = link.label ? link.label : null;
      });
    }
  }
}
