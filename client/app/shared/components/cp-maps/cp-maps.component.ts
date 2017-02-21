import {
  Input,
  OnInit,
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
export class CPMapsComponent implements OnInit, AfterViewInit {
  @Input() center: any;
  @ViewChild('map') map: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    const el = this.map.nativeElement;
    const defaultCenter = { lat: -34.397, lng: 150.644 };

    const center = this.center ? this.center : defaultCenter;
    const map = new google.maps.Map(el, {
      center,
      zoom: 8
    });

    new google.maps.Marker({
      position: center,
      map,
    });
  }

  ngOnInit() {
    // console.log(this);
  }
}
