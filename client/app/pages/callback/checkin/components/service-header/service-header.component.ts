import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-service-header',
  templateUrl: './service-header.component.html',
  styleUrls: ['./service-header.component.scss']
})
export class CheckinServiceHeaderComponent implements OnInit {
  @Input() service: any;

  constructor() { }

  ngOnInit() {
    // console.log(this);
  }
}
