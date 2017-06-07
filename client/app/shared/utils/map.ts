interface ICPMap {
  city: string;
  country: string;
  street_name: string;
  postal_code: string;
  street_number: string;
  province: string;
  latitude: number;
  longitude: number;
}
const map = {
  'city': 'locality',
  'country': 'country',
  'street_name': 'route',
  'postal_code': 'postal_code',
  'street_number': 'street_number',
  'province': 'administrative_area_level_1',
};

const locationAsObject = function locationAsObject(location) {
  let googleCords = location.toJSON();

  return {
    latitude: googleCords.lat,
    longitude: googleCords.lng
  };
};

const getValueFromAddressComponent =
  function getValueFromAddressComponent(addressComp: any[], field: string, long?: boolean) {
    let result = null;

    addressComp.map(data => {
      data.types.forEach(type => {
        if (type === field) {
          if (long) {
            result = data.long_name;
            return;
          }
          result = data.short_name;
        }
        return;
      });
    });

    return result;
  };

const getBaseMapObject = function getBaseMapObject(data) {
  let obj: ICPMap = {
    city: null,
    country: null,
    street_name: null,
    postal_code: null,
    street_number: null,
    province: null,
    latitude: null,
    longitude: null
  };

  if (!data) {
    return {
      city: '',
      name: '',
      country: '',
      street_name: '',
      postal_code: '',
      street_number: '',
      province: '',
      latitude: null,
      longitude: null
    };
  }

  Object.keys(map).map(item => {
    obj[item] = getValueFromAddressComponent(data.address_components, map[item]);
  });

  obj = Object.assign({}, obj, {...locationAsObject(data.geometry.location)});
  return obj;
};

export const CPMap = {
  locationAsObject,
  getBaseMapObject,
  getValueFromAddressComponent
};
