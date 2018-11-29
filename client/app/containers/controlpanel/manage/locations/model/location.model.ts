import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LocationModel {
  public readonly id;
  public city: string;
  public link: string;
  public name: string;
  public phone: string;
  public email: string;
  public country: string;
  public address: string;
  public province: string;
  public latitude: number;
  public logo_url: string;
  public longitude: string;
  public short_name: string;
  public link_label: string;
  public description: string;
  public postal_code: string;
  public category_id: number;

  _form: FormGroup;

  get form(): FormGroup {
    return this._form ? this._form : this.buildForm();
  }

  constructor({ ...location } = {}) {
    this.id = location['id'] || null;
    this.link = location['link'] || null;
    this.city = location['city'] || null;
    this.name = location['name'] || null;
    this.phone = location['phone'] || null;
    this.email = location['email'] || null;
    this.country = location['country'] || null;
    this.address = location['address'] || null;
    this.province = location['province'] || null;
    this.logo_url = location['logo_url'] || null;
    this.latitude = location['latitude'] || null;
    this.longitude = location['longitude'] || null;
    this.link_label = location['link_label'] || null;
    this.short_name = location['short_name'] || null;
    this.description = location['description'] || null;
    this.postal_code = location['postal_code'] || null;
    this.category_id = location['category_id'] || null;
  }

  private buildForm(): FormGroup {
    const fb = new FormBuilder();

    this._form = fb.group({
      city: [this.city],
      link: [this.link],
      phone: [this.phone],
      email: [this.email],
      country: [this.country],
      address: [this.address],
      province: [this.province],
      logo_url: [this.logo_url],
      link_label: [this.link_label],
      short_name: [this.short_name],
      postal_code: [this.postal_code],
      description: [this.description],
      name: [this.name, Validators.required],
      latitude: [this.latitude, Validators.required],
      longitude: [this.longitude, Validators.required],
      category_id: [this.category_id, Validators.required]
    });

    return this._form;
  }
}
