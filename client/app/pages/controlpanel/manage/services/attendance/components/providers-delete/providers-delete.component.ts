import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-providers-delete',
  templateUrl: './providers-delete.component.html',
  styleUrls: ['./providers-delete.component.scss']
})
export class ServicesProviderDeleteComponent implements OnInit {
  @Input() provider: any;

  constructor() { }

  onDelete() {
    console.log('deleting');
  }

  ngOnInit() { }
}
