import { Directive, Input, OnChanges, ElementRef } from "@angular/core";

@Directive({
    selector : "[elementFocusDir]"
  })
  
  export class ElementFocusDirective implements OnChanges {
    @Input("elementFocusDir") isFocus : boolean;
  
    constructor( private el :ElementRef ){
      
    }
    
    ngOnChanges () {
      
      if( this.isFocus ){
        setTimeout(() => {
          this.el.nativeElement.focus();
        }, 200);
      }
  
    }
  }
  