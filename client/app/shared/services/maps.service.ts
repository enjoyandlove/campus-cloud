/**
 * Google maps wrapper
 */
import { Injectable } from '@angular/core';

const defaultOptions: google.maps.MapOptions = {
  zoom: 16,
  draggable: true,
  disableDefaultUI: true,
  disableDoubleClickZoom: true
}

@Injectable()
export class CPMapsService {
  init(el: Element, center: google.maps.LatLngLiteral) {
    const options = Object.assign({}, defaultOptions, { center });

    return new google.maps.Map(el, options);
  }

  setMarker(map: google.maps.Map,
            position: google.maps.LatLngLiteral): google.maps.Marker {

    const marker = new google.maps.Marker({ position });
    marker.setMap(map);

    return marker;
  }

  setMarkerPosition(marker: google.maps.Marker,
                    position: google.maps.LatLngLiteral): google.maps.Marker {
    marker.setPosition(position);
    return marker;
  }

  setCenter(map: google.maps.Map,
            position: google.maps.LatLngLiteral): google.maps.Map {
    map.setCenter(position);
    return map;
  }
}
