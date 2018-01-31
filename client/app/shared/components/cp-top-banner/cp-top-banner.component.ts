import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-top-banner',
  templateUrl: './cp-top-banner.component.html',
  styleUrls: ['./cp-top-banner.component.scss'],
})
export class CPTopBanerComponent implements OnInit {

  constructor() {}

  openGAModal() {
    $('#openGAModal').modal();
  }

  ngOnInit() {}
}
