import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { ExportCategory } from '../../../../health-dashboard.utils.service';

@Component({
  selector: 'cp-health-dashboard-form-completion-activity',
  templateUrl: './health-dashboard-form-completion-activity.component.html',
  styleUrls: ['./health-dashboard-form-completion-activity.component.scss']
})
export class HealthDashboardFormCompletionActivityComponent implements OnInit {
  @Input() downloading = false;
  @Input() activities = {
    never_submitted: 0,
    not_submitted_today: 0,
    unique_submissions_today: 0
  };
  @Output() downloadCompleted: EventEmitter<boolean> = new EventEmitter();
  @Output() downloadNotCompleted: EventEmitter<boolean> = new EventEmitter();
  @Output() downloadNeverCompleted: EventEmitter<boolean> = new EventEmitter();

  public get exportCategory(): typeof ExportCategory {
    return ExportCategory;
  }

  constructor(cpI18n: CPI18nPipe) {}

  onDownload(category) {
    switch (category) {
      case ExportCategory.CompletedToday:
        this.downloadCompleted.emit(true);
        break;
      case ExportCategory.NotCompletedToday:
        this.downloadNotCompleted.emit(true);
        break;
      case ExportCategory.NeverCompleted:
        this.downloadNeverCompleted.emit(true);
        break;
    }
  }
  ngOnInit(): void {}
}
