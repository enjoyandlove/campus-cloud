import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-manage',
  templateUrl: './manage.component.html',
})
export class ManageComponent implements OnInit {
  headerData;

  constructor() {
    this.headerData = require('./manage.header.json');
  }

  ngOnInit() { }
}
