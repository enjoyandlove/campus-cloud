import { Component, Input, OnInit } from '@angular/core';
import { IToolTipContent } from './cp-tooltip.interface';

@Component({
  selector: 'cp-tooltip',
  templateUrl: 'cp-tooltip.component.html',
  styleUrls: ['cp-tooltip.component.scss']
})
export class CPTooltipComponent implements OnInit {
  @Input() toolTipContent: IToolTipContent;
  @Input() placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'bottom';

  content: string;
  triggers = '';

  constructor() {}

  ngOnInit() {
    this.content = this.toolTipContent.content;
    if (this.toolTipContent.link) {
      this.content +=
        ' <a class="cptooltip-link" href="' +
        this.toolTipContent.link.url +
        '" target="_blank">' +
        this.toolTipContent.link.text +
        '</a>';
    }

    this.triggers = this.toolTipContent.trigger === 'hover' ? 'mouseenter mouseleave' : 'click';
  }
}
