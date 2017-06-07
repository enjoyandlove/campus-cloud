import {
  Input,
  OnInit,
  ViewChild,
  Component,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

declare var google: any;

@Component({
  selector: 'cp-maps',
  templateUrl: './cp-maps.component.html',
  styleUrls: ['./cp-maps.component.scss']
})
export class CPMapsComponent implements OnInit, AfterViewInit {
  @Input() center: Observable<any>;
  @ViewChild('map') map: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    this.center.subscribe(center => {
      this.drawMap(center);
    });
  }

  drawMap(center) {
    const el = this.map.nativeElement;

    let map = new google.maps.Map(el, {
      zoom: 16,
      draggable: false,
      center: center,
      disableDefaultUI: true
    });

    new google.maps.Marker({
      position: center,
      map: map,
    });

  }

  ngOnInit() { }
}
