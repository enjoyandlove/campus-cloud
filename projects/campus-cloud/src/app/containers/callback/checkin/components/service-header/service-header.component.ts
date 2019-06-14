import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-service-header',
  templateUrl: './service-header.component.html',
  styleUrls: ['./service-header.component.scss']
})
export class CheckinServiceHeaderComponent {
  @Input() service: any;
}
