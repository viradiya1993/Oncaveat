import { Injectable } from "@angular/core";
import { ToastrService, IndividualConfig } from "ngx-toastr";

@Injectable()
export class MyToastrService {
  options: IndividualConfig;
  constructor(public toastr: ToastrService) {
    this.options = this.toastr.toastrConfig;
    this.options.positionClass = "toast-top-center";
    this.options.toastClass = "col-6 ngx-toastr top-85";
    this.options.timeOut = 5000;
  }
  showToast(title, message, type) {

    this.toastr.show(message, title, this.options, "toast-" + type);
  }
}
