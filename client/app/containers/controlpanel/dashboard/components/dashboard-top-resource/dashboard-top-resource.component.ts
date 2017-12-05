import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-dashboard-top-resource',
  templateUrl: './dashboard-top-resource.component.html',
  styleUrls: ['./dashboard-top-resource.component.scss']
})
export class DashboardTopResourceComponent implements OnInit {
  @Input() items;

  defaultImage = require('public/default/user.png');

  constructor() { }

  ngOnInit() {
    console.log(this.items);
  }
}
