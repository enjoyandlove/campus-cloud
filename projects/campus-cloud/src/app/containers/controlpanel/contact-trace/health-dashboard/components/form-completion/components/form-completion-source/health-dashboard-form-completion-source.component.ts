import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cp-health-dashboard-form-completion-source',
  templateUrl: './health-dashboard-form-completion-source.component.html',
  styleUrls: ['./health-dashboard-form-completion-source.component.scss']
})
export class HealthDashboardFormCompletionSourceComponent implements OnInit {
  @Input() sources;
  @Input() downloading = false;
  @Output() downloadSourceApp: EventEmitter<boolean> = new EventEmitter();
  @Output() downloadSourceWeb: EventEmitter<boolean> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onDownloadSourceApp() {
    this.downloadSourceApp.emit(true);
  }

  onDownloadSourceWeb() {
    this.downloadSourceWeb.emit(true);
  }
}
