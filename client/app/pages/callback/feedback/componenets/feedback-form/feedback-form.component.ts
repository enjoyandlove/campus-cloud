import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cp-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent implements OnInit {
  @Input() isEvent: boolean;
  @Input() isService: boolean;
  @Input() isSubmitted: Observable<boolean>;
  @Output() send: EventEmitter<any> = new EventEmitter();

  _isSubmitted: boolean;
  feedbackForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  onRated(rating: number): void {
    this.feedbackForm.controls['user_rating_percent'].setValue((rating / 5) * 100);
  }

  onSubmit(): void {
    this.send.emit(this.feedbackForm.value);
  }

  ngOnInit() {
    this.feedbackForm = this.fb.group({
      'user_feedback_text': [null, Validators.required],
      'user_rating_percent': [null, Validators.required],
    });

    this.isSubmitted.subscribe(res => this._isSubmitted = res);
  }
}
