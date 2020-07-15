import { Pipe, PipeTransform } from '@angular/core';
import { OriginatorType, SocialContentInteractionItem } from '@campus-cloud/services';

@Pipe({
  name: 'profileNameEmail'
})
export class ProfileNameEmailPipe implements PipeTransform {
  transform(profile: SocialContentInteractionItem): string {
    if (!profile.email || profile.originator_type === OriginatorType.store) {
      return profile.name;
    }
    return `${profile.name} (${profile.email})`;
  }
}
