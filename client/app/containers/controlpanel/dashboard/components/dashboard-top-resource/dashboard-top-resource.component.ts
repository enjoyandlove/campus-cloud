import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-dashboard-top-resource',
  templateUrl: './dashboard-top-resource.component.html',
  styleUrls: ['./dashboard-top-resource.component.scss']
})
export class DashboardTopResourceComponent implements OnInit {
  @Input() data;

  constructor() { }

  ngOnInit() { }
}
