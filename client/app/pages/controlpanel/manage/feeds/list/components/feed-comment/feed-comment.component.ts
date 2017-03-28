import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-feed-comment',
  templateUrl: './feed-comment.component.html',
  styleUrls: ['./feed-comment.component.scss']
})
export class FeedCommentComponent implements OnInit {
  @Input() last: boolean;
  @Input() comment: any;

  isComment = true;

  constructor() { }

  ngOnInit() { }
}
