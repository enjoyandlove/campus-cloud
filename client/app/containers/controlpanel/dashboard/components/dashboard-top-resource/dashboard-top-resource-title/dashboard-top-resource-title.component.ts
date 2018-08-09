import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'cp-dashboard-top-resource-title',
  templateUrl: './dashboard-top-resource-title.component.html',
  styleUrls: ['./dashboard-top-resource-title.component.scss']
})
export class DashboardTopResourceTitleComponent implements OnInit {
  @Input() item;
  @Input() canNavigate;

  constructor(public router: Router) {}

  ngOnInit() {}
}
