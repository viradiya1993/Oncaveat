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
import { BoradcastService } from "../../app/services/broadcast.service";
import { AngularMultiSelect } from "angular2-multiselect-dropdown";
import { ConfirmDialogService } from "../confirm-dialog/confirm-dialog.servicey";

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "update-summary-modal",
  templateUrl: "./update-summary.component.html"
})
export class UpdateSummaryComponent {
  @ViewChild("modalBox") modalBox;
  @ViewChild("form") f: NgForm;
  @ViewChild('topicDropdownRef', {}) dropdownRef1: AngularMultiSelect;
  @ViewChild('subTopicDropdownRef', {}) dropdownRef2: AngularMultiSelect;

  @ViewChild('subSubTopicDropdownRef', {}) dropdownRef3: AngularMultiSelect;
  @Output() onClose = new EventEmitter();
  @Input() summary_id;
  @Input() dataUpdate;



  is_edit: boolean;
  openAddPopup: boolean = false;
  htmlContent = "";
  updateData: any;
  // updateData: any = {
  //   court_name: "",
  //   topics: "",
  //   sub_topic: "",
  //   description: ""
  // };

  topicsId = "";
  subtopicId = "";
  subsubtopicId = "";
  dropdownSettingsTopic = {};
  dropdownSettingSubTopic = {};
  dropdownSettingSubSubTopic = {};
  dropdownSettingSubTopic1 = {};
  hashList: any = [];
  subTopicList: any = [];
  subTopicList1: any = []
  subsubTopicList: any = [];
  selectedItems: any;
  selectTopics = [];
  topicnew: any;
  subtopicnew: any;
  subsubtopicnew: any;
  subsubtopicname: any;
  showsubsub: boolean = false;
  loader: boolean = true;
  subtopicList = false;
  selectedSubtopic: any;
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
  constructor(
    public modalService: NgbModal,
    private casebookService: CaseBooksService,
    private broadcastService: BoradcastService,
    private toastrService: MyToastrService,
    private caseLawService: CaseLawsService,
    public confirmDialog: ConfirmDialogService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.updateData = this.dataUpdate;
    // let item_n = this.dataUpdate.categories.map(e => e.id).join(",");
    // let item_subTopic = this.dataUpdate.sub_topics_list.map(e => e.id).join(",");
    let item_n = this.dataUpdate.categories.map(e => e.name).join(",");
    let item_subTopic = this.dataUpdate.sub_topics_list.map(e => e.name).join(",");
    this.getHashList();
    //this.getSupTopicList(item_n);
    this.getSelectedSubTopicList(this.dataUpdate);
    this.getSubSubTopicList(item_subTopic);
  }

  public open() {
    if (this.summary_id) {
      this.is_edit = true;
    } else {
      this.is_edit = false;
    }
    let mo = this.modalService.open(this.modalBox, {
      // container : "casebook_small_box_popup",
      backdrop: "static",
      size: "lg",
      windowClass: ""
    });
    setTimeout(() => {
      console.log(mo.componentInstance);
    }, 300);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getHashList() {
    // this.caseLawService.getHashTags().subscribe((res: any) => {
    //   this.hashList = res.data;
    //   if(this.hashList) {
    //     this.loader = false;
    //   }
    //   this.dropdownSettingsTopic = {
    //     singleSelection: true,
    //     position: "bottom",
    //     idField: "name",
    //     labelKey: "name",
    //     text: "Select Topic",
    //     enableSearchFilter: true,
    //     addNewItemOnFilter: true,
    //     addNewButtonText: "Add Topic"
    //   };
    //   this.updateData.topics = this.updateData.categories;
    // });

    this.caseLawService.userHashtags().subscribe((res: any) => {
      this.hashList = res.data;
      if (this.hashList) {
        this.loader = false;
      }
      this.dropdownSettingsTopic = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Topic",
        searchPlaceholderText: "Or type to create"
      };
      this.updateData.topics = this.updateData.categories;
    });


  }

  getSupTopicList(item) {
    this.caseLawService.getSubTopics(item).subscribe((res: any) => {
      this.subTopicList = res.data;
      if (this.subTopicList) {
        this.loader = false;
      }

      this.dropdownSettingSubTopic = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Sub Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Sub Topic",
        searchPlaceholderText: "Or type to create"
      };
    });

  }

  getSubSubTopicList(item) {
    this.caseLawService.getSubSubTopics(item).subscribe((res: any) => {
      this.subsubTopicList = res.data;
      if (res.data === undefined || res.data.length == 0) {
        this.subsubTopicList = res.data
        // this.getSelectedSubTopicList(this.dataUpdate);
      }
      this.dropdownSettingSubSubTopic = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Sub Sub Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Sub Sub Topic",
        searchPlaceholderText: "Or type to create"
      };
    });

  }

  /** Get Select sub topic list */

  getSelectedSubTopicList(data) {
    this.caseLawService.getSelectedSubTopics(data.id).subscribe((res: any) => {
      this.subTopicList = res.data.SubTopic;
      this.updateData.selectedsubtopics = res.data.SubTopic.filter(x => x.user_role == 'admin');
      this.dropdownSettingSubTopic = {
        singleSelection: true,
        position: "bottom",
        idField: "name",
        labelKey: "name",
        text: "Select Sub Topic",
        enableSearchFilter: true,
        addNewItemOnFilter: true,
        addNewButtonText: "Add Sub Topic",
        searchPlaceholderText: "Or type to create"
      };
      this.subsubTopicList = res.data.SubSubTopic;
    });
  }



  /* Add for Topics */
  onAddTopic(item: any, f) {
    this.topicnew = item;
    this.updateData.topics = [];
    let item_n = this.updateData.topics.push({ id: "", name: item });
    f.form.controls.subtopic_list.setValue(null);
    this.onCloseTopicDropdown();
    this.subTopicList = [];

  }

  /* Select for Topics */
  onItemSelect(item: any, f) {
    let item_n = this.updateData.topics.map(e => e.id).join(",");
    //let item_n = this.updateData.topics.map(e => e.name).join(",");
    f.form.controls.subtopic_list.setValue(null);
    this.subTopicList = [];
    this.subsubTopicList = [];
    this.getSupTopicList(item_n);

  }

  /* DeSelect for Topics */
  onItemDeSelect(item: any, f) {
    let item_n = this.updateData.topics.map(e => e.id).join(",");
    //let item_n = this.updateData.topics.map(e => e.name).join(",");
    f.form.controls.subtopic_list.setValue(null);
    this.subTopicList = [];
    this.subsubTopicList = [];
    this.getSupTopicList(item_n);
  }

  /* Add for SubTopics */
  onAddSubTopic(item: any, f) {
    this.subtopicnew = item;
    this.updateData.selectedsubtopics = [];
    let item_n = this.updateData.selectedsubtopics.push({ id: "", name: item });
    this.onCloseSubTopicDropdown();
    this.subsubTopicList = [];
  }

  /* Selection for SubTopics */
  onSubItemSelect(item: any, f) {
    let item_n = this.updateData.selectedsubtopics.map(e => e.id).join(",");
    //let item_n = this.updateData.selectedsubtopics.map(e => e.name).join(",");
    this.getSubSubTopicList(item_n);
    this.subsubTopicList = [];
  }

  /* DeSelect for SubTopics */
  onSubItemDeSelect(item: any, f) {
    let item_n = this.updateData.selectedsubtopics.map(e => e.id).join(",");
    //let item_n = this.updateData.selectedsubtopics.map(e => e.name).join(",");
    this.getSubSubTopicList(item_n);
    this.subsubTopicList = [];
  }

  /* Add for SubSubTopics */
  onAddSubSubTopic(item: any, f) {
    this.subsubtopicnew = item;
    this.updateData.selectedsubsubtopics = [];
    let item_n = this.updateData.selectedsubsubtopics.push({ id: "", name: item });
    this.onCloseSubSubTopicDropdown();
  }

  /* Selection for subSubTopics */
  onSubSubItemSelect(item: any, f) {
    let item_n = this.updateData.selectedsubsubtopics.map(e => e.id).join(",");
    //let item_n = this.updateData.selectedsubsubtopics.map(e => e.name).join(",");
    this.getSubSubTopicList(item_n)
    this.subsubTopicList = [];

  }

  /* Deselect for subsubtopic */
  onSubSubItemDeSelect(item: any) {
    let item_n = this.updateData.selectedsubsubtopics.map(e => e.id).join(",");
    //let item_n = this.updateData.selectedsubsubtopics.map(e => e.name).join(",");
    this.getSubSubTopicList(item_n);
  }

  /* Close Topic Dropdown */
  onCloseTopicDropdown() {
    this.dropdownRef1.closeDropdown();
  }

  /* Close Sub-Topic Dropdown */
  onCloseSubTopicDropdown() {
    this.dropdownRef2.closeDropdown();
  }


  /* Close Sub-Sub-Topic Dropdown */
  onCloseSubSubTopicDropdown() {
    this.dropdownRef3.closeDropdown();
  }

  /* Save All */
  onSave(f) {
    this.loader = false;
    if (f.invalid) {
      return;
    }


    this.topicsId = this.updateData.topics.map(e => e.name).join(",");
    this.subtopicId = this.updateData.selectedsubtopics.map(e => e.name).join(",");
    this.subsubtopicId = this.subsubTopicList.filter(e => e.name).join(",");
    // this.subsubtopicname  = this.updateData.selectedsubsubtopics.map(e => e.name).join(",");
    this.subsubtopicname = this.updateData.selectedsubsubtopics ? this.updateData.selectedsubsubtopics.map(e => e.name).join(",") : '';

    let data = {
      //title: this.updateData.heading_description,
      title: this.updateData.sub_topic,

      topic: this.topicsId ? this.topicsId : this.topicnew,

      subtopics_list: this.subtopicId ? this.subtopicId : this.subtopicnew,

      sub_topic: this.subtopicId ? this.subtopicId : this.subtopicnew,

      // subsubtopic:  this.subsubtopicId ? this.subsubtopicId : this.subsubtopicnew,

      subsubtopic: this.subsubtopicname,

      judgement_id: this.updateData.id,

      note: this.updateData.description
    };

    this.loader = true;
    this.casebookService.createCasebook(data).subscribe(
      (res: any) => {
        // this.dataUpdate.is_saved = true;
        this.toastrService.showToast(res.message, "", "success");
        this.activeModal.close(true);
        this.loader = false;
        this.subsubTopicList = []
        this.updateData.selectedsubsubtopics = []
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
        this.loader = true;
      }
    );
  }

  /* Duplicate Judgement data */
  duplicateSaveJudgement(judgement) {
    // this.loader = false;
    this.onSave(judgement);
    // if (judgement.invalid) {
    //   return;
    // }
    // this.confirmDialog
    // .confirm("Save !", "Are you sure you want to save duplicate the judgement?").then(
    //   (confirmed) => {
    //     if (confirmed) {
    //         this.onSave(judgement);
    //     } else {
    //       this.modalService.dismissAll();
    //     }
    //   }).catch(
    //       (reason: any) => {
    //         console.log(reason,'reason');
    //       }
    //   );
    // this.loader = true;
  }

  /* Sub sub show */
  subsubshow(): void {
    this.showsubsub = !this.showsubsub;
  }
}
