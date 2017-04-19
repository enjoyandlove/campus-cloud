import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpTeamSelectedPipe',
  pure: false
})
export class TeamSelectedPipe implements PipeTransform {
  transform(services: any[]) {

    return services.filter(service => {
      if (service.checked) {
        return service;
      }
    });
  }
}
