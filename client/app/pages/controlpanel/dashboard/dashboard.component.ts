import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  headerData;

  constructor() {
    this.headerData = require('./dashboard.header.json');
  }

  ngOnInit() { }
}
