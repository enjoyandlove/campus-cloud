/**
 * Common Table shared
 * between top-events and top services
 */
import { Component, OnInit, Input } from '@angular/core';
import { environment } from './../../../../../../environments/environment';

@Component({
  selector: 'cp-dashboard-top-resource',
  templateUrl: './dashboard-top-resource.component.html',
  styleUrls: ['./dashboard-top-resource.component.scss']
})
export class DashboardTopResourceComponent implements OnInit {
  @Input() items;
  @Input() canNavigate;

  defaultImage = `${environment.root}public/default/user.png`;

  constructor() {}

  ngOnInit() {}
}
