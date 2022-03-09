import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from "@angular/core";
import { AngularEditorConfig } from "@kolkov/angular-editor";

import { MyToastrService } from "../../services/toastr.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddSummaryComponent } from "../../../modals/add-summary/add-summary.component";
import { UpdateSummaryComponent } from "../../../modals/update-summary/update-summary.component";
import { CaseBooksService } from "../../services/casebooks.service";
import { CaseLawsService } from "../../services/caselaws.service";
import { BoradcastService } from "../../services/broadcast.service";
import { ConfirmDialogService } from "../../../modals/confirm-dialog/confirm-dialog.servicey";
import { finalize } from 'rxjs/operators'
import { DOCUMENT } from "@angular/platform-browser";
import { CommonService } from "../../services/common.service";
declare var $: any;

@Component({
  selector: "casebook-summary",
  templateUrl: "./casebook-summary.component.html"
})
export class CasebookSummaryComponent implements OnInit {
  isSideMenuOpen: boolean = false;
  casebookList: any = [];
  hashList: any = [];
  topicId: any;
  hashTitle: any;
  subtitle: any
  subTopicEdit: any;
  TopicEdit: any;
  menuSubList: any;
  menuSubList1: any;
  menudisplaySubList: any = true;
  dataNotFound: boolean = false;
  selectedIndex: number = 0;
  subCategory: any = [];
  subsubCategory: Object[] = [];
  loader: boolean = true;
  currentUser: any = JSON.parse(localStorage.getItem("currentUser"))
  userName = this.currentUser.data.first_name.slice(0, 1).toUpperCase();
  searchdata: any;
  searchValue: any = '';
  arryofsub: any;
  subTopic: any;
  breadcamp: boolean = false;
  breadcampsub: boolean = false
  arraySublength: any;
  subtopicid: any;

  constructor(
    private toastrService: MyToastrService,
    public modalService: NgbModal,
    public confirmDialog: ConfirmDialogService,
    private casebookService: CaseBooksService,
    private broadcastService: BoradcastService,
    private caseLawService: CaseLawsService,
    @Inject(DOCUMENT) private document: Document,
    public commonService: CommonService,
  ) {
    this.getHashList();
    this.subtopicid = '';
  }

  ngOnInit() {
    this.broadcastService.getHandler().subscribe((data: any) => {
      if ("type" in data && data.type && data.type == "summary_created") {
        this.getHashList();
        this.subtopicid = '';
      }
    })
  }


  /*Get new subsubtopic */
  getSubsubtopic() {
    let data = {
      topic_id: this.topicId
    }
    this.casebookService.getSubtopic(data).subscribe(
      (res: any) => {
        this.arryofsub = res.data.sub_topics;
        this.arraySublength = res.data.sub_topics.length;
        if (!this.subtopicid) {
          this.subtopicid = this.arryofsub[0].id
        }
      }, err => {
        console.log(err)
      }
    );
  }

  /**Get Menu List  */
  getHashList() {
    this.casebookService.userCategories().subscribe((res: any) => {
      this.hashList = res.data.saved_categories;
      if (!this.topicId) {
        this.topicId = this.hashList[0].id;
        this.hashTitle = this.hashList[0].name;
      }

      this.getCaseBookList();
      this.getSubsubtopic();
      // this.onTopicSelect(this.hashList[0],0);
    });
  }

  /** Search Top */
  search(value: any) {
    this.subtopicid = ''
    this.menuSubList = '';
    if (this.searchdata !== value) {
      this.searchdata = value;
      this.breadcamp = false;
      this.breadcampsub = false;
    }
    this.getCaseBookList();
  }

  /* Search by click */
  searchclick(value: any) {
    this.subtopicid = ''
    this.menuSubList = '';
    if (this.searchdata !== value) {
      this.searchdata = value;
      this.breadcamp = false;
      this.breadcampsub = false;
    }
    this.getCaseBookList();
  }

  /* Reset Filter */
  resetFilter() {
    this.searchdata = '';
    this.searchValue = '';
    this.getCaseBookList();
  }

  /** Topic select  */
  onTopicSelect(hash, index: number) {
    // this.subCategory = hash.user_sub_topic
    this.subtopicid = '';
    this.subTopic = '';
    this.topicId = hash.id;
    this.hashTitle = hash.name;
    this.selectedIndex = index;
    this.searchdata = '';
    this.searchValue = '';
    this.getCaseBookList();
    this.clearFilter();
    this.getSubsubtopic();
    this.isSideMenuOpen = false;
    $(".overflow").removeClass("overflow");
    $(".overlay").removeClass("overlay");
    document.getElementById('openside').classList.remove('active');
    document.getElementById('openside2').classList.remove('active');

  }

  /*onSubTopicClick */
  onSubTopic(sub, value) {
    this.subtopicid = sub.id
    if (value != false) {
      this.subTopic = value;
      this.breadcamp = true;
      $(".show").removeClass("show");
    } else {
      this.subTopic = '';
      this.breadcamp = false;
    }

    this.menuSubList = '';
    this.searchdata = '';
    this.searchValue = '';
    this.breadcampsub = false
    this.getCaseBookList();

  }


  /** Sub sub topic key */
  onSubSubTopic(key, subsubvalue, subid) {
    this.subtopicid = subid;
    this.menuSubList = key;
    this.subTopic = subsubvalue;
    this.breadcamp = true;
    this.breadcampsub = true;
    $(".show").removeClass("show");
    this.searchdata = '';
    this.searchValue = '';
    this.getCaseBookList();
  }



  /** clearFilter */
  clearFilter() {
    this.menuSubList = "";
    this.breadcamp = false
    this.breadcampsub = false
    this.subtopicid = ''
    this.searchdata = '';
    this.searchValue = '';
    this.getCaseBookList();
    $(".show").removeClass("show");
  }

  /** Get Casebook List */
  getCaseBookList() {
    this.loader = true;
    let data = {
      topic_id: this.topicId,
      search: this.searchdata,
      sub_topics: this.subtopicid,
      flag: false
    }
    this.casebookService.getCasbookList(data)
      .pipe(finalize(() => this.loader = false)
      ).subscribe(
        (res: any) => {
          console.log(res, 'response');
          this.casebookList = res.data.topics.category;
          if (this.casebookList.length == 0) {
            this.dataNotFound = true;
            this.breadcamp = false;
            this.breadcampsub = false;
          } else {
            this.dataNotFound = false;
          }
        },
        err => {
          this.toastrService.showToast(err.error.message, "", "error");
        }
      );
  }

  /** Add Case book */
  onAddCaseBook() {
    this.modalService.dismissAll("Open login modal");
    const modal = this.modalService.open(AddSummaryComponent, {
      backdrop: "static",
      windowClass: "update-summary-wrap"
    });
    modal.componentInstance.showAdd = "Add";

  }

  /** Open Side menu */
  openSideMenu() {
    setTimeout(() => {
      this.isSideMenuOpen = !this.isSideMenuOpen;
    }, 100);
  }

  /* Menu close when outside click */
  onClickedOutside(e) {

    this.isSideMenuOpen = false;
    $(".overflow").removeClass("overflow");
    $(".overlay").removeClass("overlay");
    document.getElementById('openside').classList.remove('active');
    document.getElementById('openside2').classList.remove('active');
  }


  /** Edit Section */
  onEditSection(topic) {
    this.subTopicEdit = topic.id;
  }

  /*** Save sub sub Topic */
  onSaveSubTopic(topic) {
    let data = {
      id: topic.id,
      title: topic.casebook_title
    };

    this.casebookService.updateSubTopic(data).subscribe(
      (res: any) => {
        if (res) {
          this.subTopicEdit = "";
          this.toastrService.showToast(res.message, "", "success");
          this.subtopicid = "";
          this.getCaseBookList();
        }
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
      }
    );
  }

  /** Edit Sidebar */
  onEditSidebar(hash) {
    this.TopicEdit = hash.id;
  }

  /** Save Topic  */
  onSaveTopic(hash) {
    let data = {
      id: hash.id,
      name: hash.name
    };
    this.casebookService.updateTopic(data).subscribe(
      (res: any) => {
        if (res) {
          this.TopicEdit = "";
          this.toastrService.showToast(res.message, "", "success");
          this.getHashList();
        }
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
      }
    );
  }

  /** Sub Topic Edit */
  onSubEdit(data) {
    data.showEdit = !data.showEdit;
  }

  /** Casebook Delete */
  onCasebookDelete(caseboook) {
    if (!caseboook.loader) {
      this.confirmDialog
        .confirm("Delete !", "Are you sure you want to delete the selected judgment?")
        .then(
          (confirmed) => {
            if (confirmed) {
              caseboook.loader = true;
              var data = {
                casebook_id: caseboook.id
              };
              this.casebookService.removeCasebook(data).subscribe(
                (res: any) => {
                  this.subtopicid = '';
                  this.breadcamp = false;
                  this.breadcampsub = false;
                  this.getHashList();
                  this.getCaseBookList();
                  this.clearFilter();
                  var message = "Selected casebook removed success";
                  if (res.message) {
                    message = res.message;
                  }
                  this.toastrService.toastr.success(message, 'Success !');

                },
                (err) => {
                  err = err.error;
                  caseboook.loader = false;
                  var message = "Something went wrong. Please refresh page and try again.";
                  if (err.message) {
                    message = err.message;

                  }
                  this.toastrService.toastr.error(message, 'Error !');
                }
              )
            }

          }
        ).catch(
          (reason: any) => { }
        );

    }
  }

  /** Cancel subTopic Edit */
  onCancel() {
    this.subTopicEdit = "";
  }

  /** Topic Edit sidebar */
  onCancelSidebar() {
    this.TopicEdit = "";
  }

  /** Save note */
  onSaveNote(data) {
    let obj = {
      id: data.id,
      note: data.note
    };

    this.casebookService.updateCasebookDescription(obj).subscribe(
      (res: any) => {
        if (res) {
          this.toastrService.showToast(res.message, "", "success");
          this.getCaseBookList();
        }
      },
      err => {
        this.toastrService.showToast(err.error.message, "", "error");
      }
    );
  }

  /* Get key Object */
  getKeys(object): object {
    return Object.keys(object);
  }
  /**
   * 
   */
  getHashSubString() {
    return this.hashTitle.substring(0, 15) + '...';
  }

  getSubTopicSubString() {
    return this.subTopic.substring(0, 15) + '...';
  }

  getMenuSubListSubString() {
    return this.menuSubList.substring(0, 15) + '...';
  }
}
