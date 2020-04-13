import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonTextComponent } from './skeleton-text/skeleton-text.component';
import { SkeletonAvatarComponent } from './skeleton-avatar/skeleton-avatar.component';
import { SkeletonTableComponent } from './skeleton-table/skeleton-table.component';

@NgModule({
  exports: [SkeletonTextComponent, SkeletonAvatarComponent, SkeletonTableComponent],
  declarations: [SkeletonTextComponent, SkeletonAvatarComponent, SkeletonTableComponent],
  imports: [CommonModule]
})
export class SkeletonModule {}
