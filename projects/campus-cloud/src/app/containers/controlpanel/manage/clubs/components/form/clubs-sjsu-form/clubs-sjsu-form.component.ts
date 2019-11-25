import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-clubs-sjsu-form',
  templateUrl: './clubs-sjsu-form.component.html',
  styleUrls: ['./clubs-sjsu-form.component.scss']
})
export class ClubsSjsuFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formError: boolean;

  constructor() {}

  ngOnInit() {}
}
