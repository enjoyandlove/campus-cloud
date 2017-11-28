import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  ElementRef,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { CPMapsService } from './../../services/maps.service';
import { CPLocationsService } from '../../services/locations.service';

const cpMapsService = new CPMapsService();
const locationService = new CPLocationsService();

@Component({
  selector: 'cp-maps',
  templateUrl: './cp-maps.component.html',
  styleUrls: ['./cp-maps.component.scss']
})
export class CPMapsComponent implements OnInit, AfterViewInit {
  @Input() doubleClick = true;
  @Input() center: Observable<any>;
  @ViewChild('hostEl') hostEl: ElementRef;
  @Output() mapSelection: EventEmitter<any> = new EventEmitter();

  map: google.maps.Map;
  marker: google.maps.Marker;

  constructor() { }

  ngAfterViewInit() {
    this
      .center
      .subscribe(center => {
        const el = this.hostEl.nativeElement;
        this.map = cpMapsService.init(el, center);
        this.marker = cpMapsService.setMarker(this.map, center);

        if (this.doubleClick) {
          this.map.addListener('dblclick', (event) => {
            locationService
              .geoCode(event.latLng.toJSON())
              .then(response => this.mapSelection.emit(response))

            cpMapsService.setMarkerPosition(this.marker, event.latLng.toJSON());
          })
        }
    });
  }

  ngOnInit() { }
}
