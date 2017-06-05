import { Component, OnInit, Input } from '@angular/core';

export interface IAnimatedButton {
  type: string;
  text: string;
}

export const BUTTON_TYPE = {
  'SUBMIT': 'submit',
  'DEFAULT': 'button'
};


@Component({
  selector: 'cp-animated-button',
  templateUrl: './cp-animated-button.component.html',
  styleUrls: ['./cp-animated-button.component.scss']
})
export class CPAnimatedButtonComponent implements OnInit {
  @Input() button: IAnimatedButton;

  disabled = false;

  constructor() { }

  ngOnInit() { }
}
