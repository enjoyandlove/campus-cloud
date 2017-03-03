import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-delete-provider',
  templateUrl: './delete-provider.component.html',
  styleUrls: ['./delete-provider.component.scss']
})
export class DeleteProviderComponent implements OnInit {
  @Input() provider: any;

  constructor() { }

  onDelete() {
    console.log('deleting');
  }

  ngOnInit() {
    console.log(this);
  }
}
