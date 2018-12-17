import { FormBuilder, Validators } from '@angular/forms';

import { get as _get } from 'lodash';

export class LocationModel {
  static form(location?) {
    const fb = new FormBuilder();

    const _location = {
      city: location ? location.city : null,
      name: location ? location.name : null,
      phone: location ? location.phone : null,
      email: location ? location.email : null,
      country: location ? location.country : null,
      address: location ? location.address : null,
      province: location ? location.province : null,
      latitude: location ? location.latitude : null,
      longitude: location ? location.longitude : null,
      image_url: location ? location.image_url : null,
      short_name: location ? location.short_name : null,
      description: location ? location.description : null,
      postal_code: location ? location.postal_code : null,
      category_id: location ? location.category_id : null,
    };

    return fb.group({
      city: [_location.city],
      phone: [_location.phone],
      email: [_location.email],
      country: [_location.country],
      address: [_location.address],
      province: [_location.province],
      image_url: [_location.image_url],
      short_name: [_location.short_name],
      postal_code: [_location.postal_code],
      description: [_location.description],
      name: [_location.name, Validators.required],
      latitude: [_location.latitude, Validators.required],
      longitude: [_location.longitude, Validators.required],
      category_id: [_location.category_id, Validators.required],
      links: fb.array([this.setLinks(location)]),
      schedule: fb.array([]),
    });
  }

  static setLinks(locations) {
    const fb = new FormBuilder();
    const links = _get(locations, 'links', null);

    return fb.group({
      url: [links ? links[0]['url'] : ''],
      label: [links ? links[0]['label'] : ''],
    });
  }
}
