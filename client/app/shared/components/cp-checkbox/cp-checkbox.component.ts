import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-checkbox',
  templateUrl: './cp-checkbox.component.html',
  styleUrls: ['./cp-checkbox.component.scss']
})
export class CPCheckboxComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  onChange(evt) {
    console.log(evt.target.checked);
  }
}
