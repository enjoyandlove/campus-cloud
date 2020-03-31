import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  exportAs: 'gallery',
  selector: 'ready-ui-gallery-group',
  templateUrl: './gallery-group.component.html',
  styleUrls: ['./gallery-group.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GalleryGroupComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
