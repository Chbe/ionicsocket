import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the UsernamePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'username',
})
export class UsernamePipe implements PipeTransform {
  transform(valor) {

    var re = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
    while (match = re.exec(valor)) {
      matches.push('@' + match[1]);
    }
    return valor.replace(matches, '<span class="pipeUsername">$&</span>');;
  }
}
