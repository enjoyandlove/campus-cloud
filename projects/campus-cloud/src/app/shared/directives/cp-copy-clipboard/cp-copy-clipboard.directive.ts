import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({ selector: '[cpCopyClipboard]' })
export class CPCopyClipboardDirective {
  @Input() cpCopyClipboard: string;

  @Output() copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();

    if (!this.cpCopyClipboard) {
      return;
    }

    const el = document.createElement('textarea');
    el.value = this.cpCopyClipboard;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }

    this.copied.emit(this.cpCopyClipboard);
  }
}
