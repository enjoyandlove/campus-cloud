import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CPMapsService } from './../../services/maps.service';
import { CPLocationsService } from '../../services/locations.service';

@Component({
  selector: 'cp-maps',
  templateUrl: './cp-maps.component.html',
  styleUrls: ['./cp-maps.component.scss']
})
export class CPMapsComponent implements OnInit, AfterViewInit {
  @Input() doubleClick = true;
  @Input() draggable = true;
  @Input() center: Observable<any>;
  @ViewChild('hostEl') hostEl: ElementRef;
  @Output() mapSelection: EventEmitter<any> = new EventEmitter();

  map: google.maps.Map;
  marker: google.maps.Marker;

  constructor(public locationService: CPLocationsService, public cpMapsService: CPMapsService) {}

  drawMap() {
    this.center.subscribe((center) => {
      const el = this.hostEl.nativeElement;
      this.map = this.cpMapsService.init(el, center, this.draggable);
      this.marker = this.cpMapsService.setMarker(this.map, center);

      if (this.doubleClick) {
        this.map.addListener('dblclick', (event) => {
          this.locationService.geoCode(event.latLng.toJSON()).then((response) => {
            const location = event.latLng;

            response = { ...response, geometry: { location } };

            this.mapSelection.emit(response);
          });

          this.cpMapsService.setMarkerPosition(this.marker, event.latLng.toJSON());
        });
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(
      () => {
        /**
         * INTENTIONAL
         * Ensures the hosting div is
         * visible when this component is initialized
         */
        this.drawMap();
      },

      10
    );
  }

  ngOnInit() {}
}
