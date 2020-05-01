import { Input, Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'ready-ui-skeleton-text',
  templateUrl: './skeleton-text.component.html',
  styleUrls: ['./skeleton-text.component.scss']
})
export class SkeletonTextComponent implements OnInit {
  @Input()
  width: string;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    (this.el.nativeElement as HTMLElement).style.width = this.width;
  }
}
