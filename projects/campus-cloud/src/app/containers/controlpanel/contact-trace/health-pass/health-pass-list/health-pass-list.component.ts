import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import IHealthPass from '@controlpanel/contact-trace/health-pass/health-pass.interface';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-health-pass-list',
  templateUrl: './health-pass-list.component.html',
  styleUrls: ['./health-pass-list.component.scss']
})
export class HealthPassListComponent implements OnInit {

  @Input()
  list: IHealthPass[];

  @Output() select = new EventEmitter();

  envRootPath = environment.root;

  constructor() { }

  ngOnInit(): void {
  }

}
