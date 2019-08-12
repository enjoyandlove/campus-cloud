import { OnInit, Input, Output, Component, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { mapTo } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  inputChange = new Subject();

  // avoid animating when page loads
  animateBg$ = this.inputChange.asObservable().pipe(mapTo(true));

  constructor() {}

  ngOnInit() {}
}
