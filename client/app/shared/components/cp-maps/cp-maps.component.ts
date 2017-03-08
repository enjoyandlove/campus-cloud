import {
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  Component,
  ElementRef,
  AfterViewInit
} from '@angular/core';

declare var google: any;

@Component({
  selector: 'cp-maps',
  templateUrl: './cp-maps.component.html',
  styleUrls: ['./cp-maps.component.scss']
})
export class CPMapsComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() center: any;
  @ViewChild('map') map: ElementRef;
  _map;
  _center;

  constructor() { }

  ngAfterViewInit() {
    this.drawMap();
  }

  drawMap() {
    const el = this.map.nativeElement;
    const defaultCenter = { lat: -34.397, lng: 150.644 };

    this._center = this.center ? this.center : defaultCenter;

    this._map = new google.maps.Map(el, {
      zoom: 8,
      draggable: false,
      center: this._center,
      disableDefaultUI: true
    });

    new google.maps.Marker({
      position: this._center,
      map: this._map,
    });
  }

  ngOnChanges() {
    if (this.center) {
      this.drawMap();
    }
  }

  ngOnInit() {
  }
}
