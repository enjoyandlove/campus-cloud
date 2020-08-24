import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

  transform(user: {firstname: string, lastname: string}, ...args: unknown[]): string {
    return (user.firstname ? (user.firstname + ' ') : '') + (user.lastname ? user.lastname : '');
  }

}
