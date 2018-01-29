import { Component, OnInit, Input } from '@angular/core';
import { IToolTipContent } from './cp-tooltip.interface';

@Component({
  selector: 'cp-tooltip',
  templateUrl: 'cp-tooltip.component.html',
  styleUrls: ['cp-tooltip.component.scss'],
})
export class CPTooltipComponent implements OnInit {
  @Input() toolTipContent: IToolTipContent;

  content: string;

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

    if (this.toolTipContent.trigger === 'hover') {
      this.hover();
    } else if (this.toolTipContent.trigger === 'click') {
      this.click();
    } else {
      this.manual();
    }
  }

  hover() {
    $('.pop').popover({
      trigger: 'hover',
    });
  }

  click() {
    $('.pop').popover({
      trigger: 'click',
    });
  }

  manual() {
    $('.pop')
      .popover({
        trigger: 'manual',
        animation: false,
      })
      .on('mouseenter', function() {
        const _this = this;
        $(this).popover('show');
        $('.popover').on('mouseleave', function() {
          $(_this).popover('hide');
        });
      })
      .on('mouseleave', function() {
        const _this = this;
        setTimeout(
          () => {
            if (!$('.popover:hover').length) {
              $(_this).popover('hide');
            }
          },

          100,
        );
      });
  }
}
