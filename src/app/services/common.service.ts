import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: "root"
})

export class CommonService {

  //public isSearchOpen = false;
  public isSearchOpen: boolean;
  public isMobileMenuOpen = false;
  public isHeaderSearchVisible : boolean;

  constructor(
    private titleService: Title,
    private meta: Meta
    ) {

  }

  public isMobileSearchShow() {
    return this.isSearchOpen;
  }

  public isMobileMenuDisplay() {
    return this.isMobileMenuOpen;
  }
  public isHeaderSearchIconVisible() {
    return this.isHeaderSearchVisible;
  }
  addtag(type,title) {
   // alert(type)
    switch (type) {
      case "facebook":
        this.meta.addTag({ property: 'og:title', content: title });
        this.meta.updateTag({property: 'og:title', content: title});
        this.meta.updateTag({property: 'og:description', content: title});
        console.log(type,'facebook')
       break;

       case "twitter":
        this.meta.addTag({ property: 'twitter:title', content: title });
        this.meta.updateTag({property: 'twitter:title',content: title});
        this.meta.updateTag({property: 'twitter:description',content: title});
       console.log(type,'twitter');
       break;
    }

  }
  onSocialSharing(type, judegmentId, details) {
    let url = environment.shareUrl + "judegment-detail/" + judegmentId;
    console.log(details)
    switch (type) {
      case "facebook":
        url = "https://facebook.com/sharer.php?u=" + url;
        break;
      case "twitter":
        url = "https://twitter.com/share?url=" + url;
        break;
      case "gmail":
        url = "https://www.instagram.com/?url=" + url;
        break;
      case "linkedin":
        url = "https://www.linkedin.com/shareArticle?mini=true&url=" + url;
        break;
      case "whatsapp":
        url = "whatsapp://send?text=" + url;
        break;
    }
   // this.addtag(type,details);
    window.open(url, "_blank");
  }

  onSocialSharingWithoutId(type) {
    console.log("0000000000", type);
    let url = environment.shareUrl;
    switch (type) {
      case "facebook":
        url = "https://facebook.com/sharer.php?u=" + url;
        break;
      case "twitter":
        url = "https://twitter.com/share?url=" + url;
        break;
      case "gmail":
        url = "https://www.instagram.com/?url=" + url;
        break;
      case "linkedin":
        url = "https://www.linkedin.com/shareArticle?mini=true&url=" + url;
        break;
      case "whatsapp":
        url = "whatsapp://send?text=" + url;
        break;
    }
    window.open(url, "_blank");
  }
}
