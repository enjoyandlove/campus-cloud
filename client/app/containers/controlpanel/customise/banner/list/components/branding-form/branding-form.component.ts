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
  @Input() imageSizeToolTip;
  @Input() tooltipContent: string;

  @Output() onUploadLogo: EventEmitter<any> = new EventEmitter();
  @Output() onRemoveLogo: EventEmitter<null> = new EventEmitter();
  @Output() onChangeColor: EventEmitter<string> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
