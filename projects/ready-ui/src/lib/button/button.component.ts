/* tslint:disable:component-selector */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'button[readyBtn], a[readyBtn]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
