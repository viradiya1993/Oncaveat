import { PipeTransform, Pipe } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: 'highlight'
})
export class HighlightSearch implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}
  transform(value: any, args: any): any {
    var capital: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var small: string = 'abcdefghijklmnopqrstuvwzyz';
    if (!args) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    if (args) {
      if (args.startsWith(".") && args.endsWith(".")) {
        return this.sanitizer.bypassSecurityTrustHtml(value);

      } else if(args.startsWith(".") && args.endsWith("/")) {
         return this.sanitizer.bypassSecurityTrustHtml(value);
      }
      else if(args.startsWith("/")) {
        //console.log(args.startsWith("."));
        return this.sanitizer.bypassSecurityTrustHtml(value);
      }

      //console.log('25')fromCharCode
    }
    // console.log(capital[0]);
    // console.log(args.startsWith(capital[0]),'40');
    if (value){

     // console.log(value,'hight light')
      // Match in a case insensitive maneer
      const re = new RegExp(args, 'gi');
      const match = value.match(re);
      // If there's no match, just return the original value.
      if (!match) {
        return this.sanitizer.bypassSecurityTrustHtml(value);
      }

      const replacedValue = value.replace(re, "<mark-new>" + match[0] + "</mark-new>")
      return this.sanitizer.bypassSecurityTrustHtml(replacedValue)
    }

  }
}
