import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-branding-form',
  templateUrl: './branding-form.component.html',
  styleUrls: ['./branding-form.component.scss']
})
export class BrandingFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() textLogo: string;
  @Input() pkdbLink: string;

  @Output() uploadLogo: EventEmitter<any> = new EventEmitter();
  @Output() removeLogo: EventEmitter<null> = new EventEmitter();
  @Output() changeColor: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
