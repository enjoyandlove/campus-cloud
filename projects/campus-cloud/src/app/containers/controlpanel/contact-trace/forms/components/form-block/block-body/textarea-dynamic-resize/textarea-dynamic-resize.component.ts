import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-textarea-dynamic-resize',
  templateUrl: './textarea-dynamic-resize.component.html',
  styleUrls: ['./textarea-dynamic-resize.component.scss']
})
export class TextareaDynamicResizeComponent implements OnInit {
  @Input()
  classErrorCondition: boolean;
  @Input()
  form: {text};
  @Input()
  minHeight = 24;

  numberOfLines = 1;

  constructor() { }

  ngOnInit(): void {
    if (this.form.text != null) {
      this.updateNumberOfLines(this.form.text);
    }
  }

  keyDown(value) {
    this.updateNumberOfLines(value);
  }

  private updateNumberOfLines(value) {
    const count = (value.match(/\n/g) || []).length;
    this.numberOfLines = count + 1;
  }

}
