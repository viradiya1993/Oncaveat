import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  TemplateRef
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { NgForm } from "@angular/forms";
// import { IDropdownSettings } from "ng-multiselect-dropdown";
import { CaseBooksService } from "../../app/services/casebooks.service";
import { MyToastrService } from "../../app/services/toastr.service";
import { CaseLawsService } from "../../app/services/caselaws.service";
import { Subject } from "rxjs";
import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { BoradcastService } from "../../app/services/broadcast.service";
import { AngularMultiSelect } from "angular2-multiselect-dropdown";
import { ConfirmDialogService } from "../confirm-dialog/confirm-dialog.servicey";

@Component({
  selector: "add-summary-modal",
  templateUrl: "./add-summary.component.html"
})
export class AddSummaryComponent {
  private onSummaryCreated = new Subject;

  @ViewChild("modalBox") modalBox;
  @ViewChild("form") f: NgForm;
  @ViewChild('topicDropdownRef', {}) dropdownRef: AngularMultiSelect;
  @ViewChild('subTopicDropdownRef', {}) dropdownRef2: AngularMultiSelect;
  @ViewChild('subsubTopicDropdownRef', {}) dropdownRef3: AngularMultiSelect;
  @Output() onClose = new EventEmitter();
  @Input() summary_id;



  is_edit: boolean;
  htmlContent = "";
  addData: any = {
    judgement_id: "",
    topics: "",
    selectedsubtopics: "",
    subsubtopic: "",
    heading_description: "N/A",
    // courts: "",
    sub_topic: "",
    description: "N/A",
    title: "",
    judgment_title: "",
    judge_name: "",
  };

  topicsId = "";
  subtopicId = "";
  subsubtopicId = "";
  courtName = "";
  dropdownAddSettings = {};
  dropdownSettings = {};
  dropdownSettingTopic = {};
  dropdownSettingsubsubTopic = {};
  hashList: any = [];
  subTopicList: any = [];
  subsubTopicList: any = [];
  loader:boolean = false;
 // subtopicdisable = true;
  topicnew : any;
  subtopicnew : any;
  subsubtopicnew: any;
  showsubsub: boolean = false;
  currentUser: any;
  userId: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };

  courtsDropdown = [];
  constructor(
    public modalService: NgbModal,
    private casebookService: CaseBooksService,
    private broadcastService: BoradcastService,
    private toastrService: MyToastrService,
    private caseLawService: CaseLawsService,
    public confirmDialog: ConfirmDialogService,
  ) {

    }

  ngOnInit() {
    this.dropdownAddSettings = {
      singleSelection: false,
      position: "bottom",
      idField: "name",
      labelKey: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 5,
      text: "Select Courts",
      enableSearchFilter: true,
      addNewItemOnFilter: true
    };
    this.courtsDropdown = [
      {"id":1,"name":"High Court"},
      {"id":2,"name":"Supreme Court"}
    ];
    this.getHashList();
    this.getSupTopicList('');
    this.getSubSubTopicList('');
  }

  /** Get Topic list */
  getHashList() {
    this.caseLawService.userHashtags().subscribe((res: any) => {
      this.hashList = res.data;
      this.dropdownSettings = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Topic",
        searchPlaceholderText : "Or type to create"
      };
    });
  }

  /** Get Sub Topic list */
  getSupTopicList(item) {
    this.caseLawService.getSubTopics(item).subscribe((res: any) => {
      this.subTopicList = res.data;
      this.dropdownSettingTopic = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Sub Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Sub Topic",
        searchPlaceholderText : "Or type to create"
      };
    });
  }

  /** Get sub sub Topic list */
  getSubSubTopicList(item) {
    this.caseLawService.getSubSubTopics(item).subscribe((res: any) => {
      this.subsubTopicList = res.data;
      this.dropdownSettingsubsubTopic = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Sub Sub Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Sub Sub Topic",
        searchPlaceholderText : "Or type to create"
      };
    });
  }

  /* Add Topic */
  onAddTopic(item: any, f) {
    console.log(item,'1')
    this.topicnew = item;
    this.addData.topics = []
    let item_n = this.addData.topics.push({ id: "", name: item });
    console.log(item_n,'2');
      
    f.form.controls.subtopic_list.setValue(null);
    this.onCloseTopicDropdown();
    this.subTopicList = [];
  }

  /* Select Topic */
  onItemSelect(item: any, f) {
    let item_n = this.addData.topics.map(e => e.id).join(",");
    console.log(item_n,'3');
    
    f.form.controls.subtopic_list.setValue(null);
    this.subTopicList = [];
    this.subsubTopicList = [];
    this.getSupTopicList(item_n);
  }

  /** Deselect Topic */
  onItemDeSelect(item: any, f) {
    let item_n = this.addData.topics.map(e => e.id).join(",");
    f.form.controls.subtopic_list.setValue(null);
    this.subTopicList = [];
    this.subsubTopicList = [];
    this.getSupTopicList(item_n);
  }

  /** Add Sub Topic */
  onAddSubTopic(item: any, f) {
    this.subtopicnew = item;
    this.addData.selectedsubtopics = []
    let item_n = this.addData.selectedsubtopics.push({ id: "", name: item });
    //f.form.controls.subsubtopic_list.setValue(null);
    //console.log(item_n,'subtopic');
    this.onCloseSubTopicDropdown();
  }

  /** Select sub topic  */
  onSubItemSelectList(item: any,f) {
    let item_n = this.addData.selectedsubtopics.map(e => e.id).join(",");
    this.subsubTopicList = [];
    this.getSubSubTopicList(item_n)
  }

   /** Deselect sub topic */
  onSubItemDeSelect(item: any,f) {
    let item_n = this.addData.selectedsubtopics.map(e => e.id).join(",");
    this.getSubSubTopicList(item_n)
    this.subsubTopicList = [];

  }

  /** Add sub sub topic */
  onAddSubSubTopic(item: any, f) {
    this.subsubtopicnew = item;
    this.addData.subsubtopic =[]
    let item_n = this.addData.subsubtopic.push({ id: "", name: item });
    this.onCloseSubSubTopicDropdown();
  }

  /** Select sub sub topic  */
  onSubSubItemSelectList(item: any) {
    let item_n = this.addData.subsubtopic.map(e => e.id);
    this.subsubTopicList = []
  }

 /** Deselect sub sub topic */
  onSubSubItemDeSelect(item: any) {
    let item_n = this.addData.subsubtopic.map(e => e.id).join(",");
    this.getSubSubTopicList(item_n);
  }

  /* Close Topic Dropdown */
  onCloseTopicDropdown() {
    this.dropdownRef.closeDropdown();
  }

  /* Close Sub-Topic Dropdown */
  onCloseSubTopicDropdown() {
    this.dropdownRef2.closeDropdown();
  }

  /* Close Sub-Sub-Topic Dropdown */
  onCloseSubSubTopicDropdown() {
    this.dropdownRef3.closeDropdown();
  }

  // public open() {
  //   if (this.summary_id) {
  //     this.is_edit = true;
  //   } else {
  //     this.is_edit = false;
  //   }
  //   let mo = this.modalService.open(this.modalBox, {
  //     // container : "casebook_small_box_popup",
  //     backdrop : 'static',
  //     size: "lg",
  //     windowClass: ""
  //   });
  //   setTimeout(() => {
  //     console.log(mo.componentInstance);
  //   }, 300);
  // }

  closeModal() {
    this.modalService.dismissAll();
  }

  onCourtSelect(item: any) {
    console.log(item);
  }

  onCourtDeSelect(item: any) {
    console.log(item);
  }

  onAddCourt(item: any) {
    console.log(item);
    console.log(this.addData);
    // console.log(this.addData);
    let item_n = this.addData.courts.push({id: "", name: item});
    console.log(item_n);

    // this.getSupTopicList(item_n);
  }

  onSelectAllCourt(items: any) {
    console.log(items);
    // let item_n = items.map(e => e.id).join(",");
    // this.getSupTopicList(item_n);
  }

  onSelectAll(items: any) {
    console.log(items);
    let item_n = items.map(e => e.id).join(",");
    this.getSupTopicList(item_n);
  }

  /* Save All */
  onSave(f) {
    this.loader = false;
    if (f.invalid) {
      return;
    }
    this.topicsId = this.addData.topics.map(e => e.id).join(",");
    this.subtopicId = this.addData.selectedsubtopics.map(e => e.id).join(",");
    //this.subtopicId = this.addData.selectedsubtopics ? this.addData.selectedsubtopics.map(e => e.id).join(","): 'Miscellaneous';
    this.subsubtopicId =  this.addData.subsubtopic ? this.addData.subsubtopic.map(e => e.name).join(",") : '';
    //this.subsubtopicId = this.addData.subsubtopic.map(e => e.id).join(",");
    //this.subsubtopicId = this.addData.subsubtopic.map(e => e.name).join(",") ;


    // console.log(this.topicsId,'topic id')
    // console.log(this.subtopicId,'sub topic id')
     //console.log(this.subsubtopicId,'sub sub topic id')

    let data = {
      court_list: this.courtName,

      judgement_id: "",

      note: this.addData.description,

      // sub_topic: this.addData.sub_topic,
      topic: this.topicsId ? this.topicsId : this.topicnew,

      judgment_title: this.addData.judgment_title,

      judge_name: this.addData.judge_name,

      sub_topic: this.subtopicId ? this.subtopicId : this.subtopicnew,

      subtopics_list: this.subtopicId ? this.subtopicId : this.subtopicnew,

      //subsubtopic: this.addData.subsubtopic,
      subsubtopic: this.subsubtopicId ? this.subsubtopicId : this.subsubtopicnew,

      //title: this.addData.heading_description,
      title: this.addData.title,
    };



    this.loader = true;

    //1)Topic = topic id
    //2)subtopics_list = subtopicid
    //3)subsubtopic = subsubtopic
    //console.log(data,'final data');
    //return;
    this.casebookService.createCasebook(data).subscribe(
      (res: any) => {
        this.toastrService.showToast(res.message, "", "success");
        this.modalService.dismissAll();
        this.broadcastService.broadcast({
          "type": "summary_created"
        })
        this.loader = false;
        this.onClose.emit({ created: true });
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
        this.loader = true;
      }
    );
  }
  /* Duplicate data */
  unsaveJudgement(judgement) {
    // if (judgement.is_saved && !judgement.loader) {
    //   this.confirmDialog
    //     .confirm("Unsave !", "Are you sure you want to unsave the judgement ?")
    //     .then(
    //       (confirmed) => {
    //         if (confirmed) {
    //           judgement.loader = true;
    //           var data = {
    //             judgement_id: judgement.id
    //           };
    //           this.casebookService.removeCasebook(data).subscribe(
    //             (res: any) => {
    //               judgement.loader = false;
    //               judgement.is_saved = false;
    //               var message = "Selected judgment removed success";
    //               if (res.message) {
    //                 message = res.message;
    //               }
    //               this.toastrService.toastr.success(message, 'Success !');
    //             },
    //             (err) => {
    //               err = err.error;
    //               judgement.loader = false;
    //               var message = "Something went wrong. Please refresh page and try again.";
    //               if (err.message) {
    //                 message = err.message;
    //               }
    //               this.toastrService.toastr.error(message, 'Error !');
    //             }
    //           )
    //         }
    //       }
    //     ).catch(
    //       (reason: any) => {

    //       }
    //     );
    // }
    this.loader = false;
    if (judgement.invalid) {
      return;
    }
    this.topicsId = this.addData.topics.map(e => e.id).join(",");
    this.subtopicId = this.addData.selectedsubtopics.map(e => e.id).join(",");
    //this.subtopicId = this.addData.selectedsubtopics ? this.addData.selectedsubtopics.map(e => e.id).join(","): 'Other';
    this.subsubtopicId =  this.addData.subsubtopic ? this.addData.subsubtopic.map(e => e.name).join(",") : 'Other';
    //this.subsubtopicId = this.addData.subsubtopic.map(e => e.id).join(",");
    //this.subsubtopicId = this.addData.subsubtopic.map(e => e.name).join(",") ;
    this.confirmDialog
    .confirm("Unsave !", "Are you sure you want to unsave the judgement duplicate ?").then(
      (confirmed) => {
        if (confirmed) {

        }
      }).catch(
          (reason: any) => {
            var data = {
              court_list: this.courtName,

              judgement_id: "",

              note: this.addData.description,

              // sub_topic: this.addData.sub_topic,
              topic: this.topicsId ? this.topicsId : this.topicnew,

              judgment_title: this.addData.judgment_title,

              judge_name: this.addData.judge_name,

              sub_topic: this.subtopicId ? this.subtopicId : this.subtopicnew,

              subtopics_list: this.subtopicId ? this.subtopicId : this.subtopicnew,

              //subsubtopic: this.addData.subsubtopic,
              subsubtopic: this.subsubtopicId ? this.subsubtopicId : this.subsubtopicnew,

              //title: this.addData.heading_description,
              title: this.addData.title,
            };
            this.casebookService.createCasebook(data).subscribe(
              (res: any) => {
                this.toastrService.showToast(res.message, "", "success");
                this.modalService.dismissAll();
                this.broadcastService.broadcast({
                  "type": "summary_created"
                })
                this.loader = false;
                this.onClose.emit({ created: true });
              },
              err => {
                this.toastrService.showToast(err.error.message, "", "error");
                this.loader = true;
              }
            );
          }
        );
    this.loader = true;


  }
  /* Sub sub show */
  subsubshow():void {
    this.showsubsub = !this.showsubsub;
  }
}
