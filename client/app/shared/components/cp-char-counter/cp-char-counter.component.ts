import { Component, Input } from '@angular/core';

@Component({
  selector: 'cp-char-counter',
  templateUrl: './cp-char-counter.component.html',
  styleUrls: ['./cp-char-counter.component.scss']
})

export class CPCharCounterComponent {
  @Input() limit: number;
  @Input() charCount: string;
}
