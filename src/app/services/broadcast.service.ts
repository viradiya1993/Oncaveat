import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";

@Injectable({
  providedIn : "root"
})

export class BoradcastService {
  
  private _handler = new Subject;

  constructor() {
    
  }

  public getHandler (){
    return this._handler;
  }

  public broadcast ( data ){
    return this._handler.next( data );
  }
  

}
