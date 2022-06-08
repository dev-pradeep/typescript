import { Injectable } from "@angular/core";
import { appConfig, developingType } from "../../environments/proConfig";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Profile } from "../../classes/classes.module";
import { Observable } from "rxjs";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { AuthimagePipe } from "../services/authimage.pipe";
import { LocalNotifications } from "@awesome-cordova-plugins/local-notifications/ngx";
import { TranslateService } from "@ngx-translate/core";
import { Platform } from "@ionic/angular";
import { AuthenticationService } from "./authentication.service";
import { ToastService } from "./toast.service";
import { LoaderService } from "./loader.service";

@Injectable({
  providedIn: "root",
})
export class WebserviceService {
  appconfig: any;
  version: string;
  birthdayTitle: string;
  birthdayDesc: string;

  apiEndPoint: any = {
    profileApi: "/api-path/users/profile",
    uploadProfilePhotoApi: "/api-path/users/profile/photo",
    memberCommonApi: "/api-path/users/members/",
    loginApi: "/api-path/users/auth",
    registerApi: "/api-path/users/register",
    processRegisterCodeApi: "/api-path/users/process-registration-code",
    processConfirmationCodeApi: "/api-path/users/process-confirmation-code",
    recoverPasswordApi: "/api-path/users/process-password-recover",
    updateUserProfileApi: "/api-path/users/profile",
    getRelationApi: "/api-path/users/members/relation-types",
    linkProfileApi: "/api-path/users/link-profile",
    forgotPasswordApi: "/api-path/users/request-password-recover",
    changePasswordApi: "/api-path/users/change-password",
    confirmNumberApi:
      "/api-path/users/profile/process-phone-change-confirmation-code",
    publicBenefitListApi: "/api-path/benefits/list?",
    adminBenefitListApi: "/api-path/benefits",
    savingTipApi: "/api-path/saving-tips/feeds?",
    categoryListApi: "/api-path/benefits/categories",
    memberShipListApi: "/api-path/memberships",
    tagListApi: "/api-path/saving-tips/tags",
    benefitCommonApi: "/api-path/benefits/",
    declineBenefitApi: "/api-path/benefits/decline",
    approveBenefit: "/api-path/benefits/approve",
    benefitChangeStatusApi: "/api-path/benefits/change-status",
    contractListApi: "/api-path/contracts/",
    requestContract: "/api-path/contracts/request-contract-offer",
    houseFinanceApi: "/api-path/contracts/house-of-finance/calculate",
    requestFinanceApi:
      "/api-path/contracts/house-of-finance/request-financial-optimization",
    blogApi: "https://domain.com/wp-json/wp/v2/posts?_embed",
    expiringContract: "/api-path/contracts/expiring",
    termsLink: "https://domain.com/termsconditions-app/",
    privacyLink: "https://domain.com/privacypolicy-app/",
    requestProfileLinkApi: "/api-path/users/request-profile-linking",
    reportProblemApi: "/api-path/report-the-problem",
    requestActivationApi: "/api-path/users/request-account-activation",
    readDocumentApi: "/api-path/contracts/",
    attachmentApi: "/attachments/read-document",
    setDeviceToken: "/api-path/users/set-device-reg-token",
    contractTypes: "/api-path/information/contract-types",
    partnersList: "/api-path/information/partners",
    dominationApi: "/api-path/information/denominations",
    taxReturnAPi: "/api-path/request/tax-return",
    subScribePlan: "/api-path/memberships/subscribe-plan",
    dashboardQuote: "/api-path/quote",
    uploadContract: "/api-path/contracts/upload",
  };
  
  constructor(
    private httpclient: HttpClient,
    private nativeStorage: NativeStorage,
    private authimage: AuthimagePipe,
    private localNotifications: LocalNotifications,
    private translateService: TranslateService,
    private platform: Platform,
    private authService: AuthenticationService,
    private toast: ToastService,
    private loader: LoaderService
  ) {
    this.appconfig = appConfig[developingType];
  }

  /**
   * Call Api using Post method
   *
   * @param {string} url Api Url Endpoint
   * @param {object} data Data Object to be passed in Api
   * @param {boolean} userToken true/false
   * userToken = false, Use Common Token Of ApiDoc
   * userToken = true, Use logged in Usertoken
   */
  postHttp(url, data, userToken: boolean): Observable<object> {
    const token = !userToken
      ? this.appconfig.token
      : localStorage.getItem("token");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });
    return this.httpclient.post(this.appconfig.url + url, data, {
      headers,
    });
  }

  /**
   * Call Api using Get method
   *
   * @param url Api Url Endpoint
   * @param data
   */
  getHttp(url, data: { key: string; val: string }[] = []) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });
    let params = new HttpParams();
    data.forEach((param) => {
      params = params.set(param.key, param.val);
    });
    return this.httpclient.get(this.appconfig.url + url, { headers, params });
  }

  /**
   * Call Api using Get Blog
   * @param {string} url Api Url Endpoint
   */
  getBlog(url): Observable<object> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.httpclient.get(url, { headers });
  }

  /**
   * get logged in user profile
   * @param {string} url Api Url
   */
  getProfile(url): Promise<object> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });
    return new Promise((resolve, reject) => {
      this.httpclient.get(this.appconfig.url + url, { headers }).subscribe(
        (getProfile: { user: Profile }) => {
          const user: any = getProfile.user;
          localStorage.setItem("id", user.id.toString());
          localStorage.setItem("first_name", user.first_name);
          localStorage.setItem("last_name", user.last_name);
          localStorage.setItem("email", user.email);
          localStorage.setItem("address", user.address);
          localStorage.setItem("birthday", user.birthday);
          localStorage.setItem("phone_country_code", user.phone_country_code);
          localStorage.setItem("phone", user.phone);
          localStorage.setItem("photo", user.photo);
          if (user.photo_key) {
            localStorage.setItem("photo_key", user.photo_key);
          }
          if (user.settings) {
            localStorage.setItem(
              "file_upload_url",
              user.settings.file_upload_url
            );
          }
          localStorage.setItem("consult_phone", user.personalConsultant.phone);
          localStorage.setItem("consult_email", user.personalConsultant.email);
          if (user.membership) {
            localStorage.setItem("userMembershipId", user.membership.id);
            if (user.membership.name === "Free") {
              user.membership.name = "Basic";
            }
            if (user.membership.name === "Start") {
              user.membership.name = "Starter";
            }
            localStorage.setItem("userMembershipName", user.membership.name);
          }
          if (user.personalConsultant.photo) {
            localStorage.setItem(
              "consult_photo",
              user.personalConsultant.photo
            );
          } else {
            localStorage.setItem(
              "consult_photo",
              "/assets/images/financial-coach.png"
            );
            localStorage.setItem("consult_photo_default", "true");
          }
          if (typeof user.push_notifications_config == "object") {
            localStorage.setItem(
              "push_notifications_config",
              JSON.stringify(user.push_notifications_config)
            );
          } else {
            localStorage.setItem(
              "push_notifications_config",
              user.push_notifications_config
            );
          }
          if (user.client != null) {
            localStorage.setItem(
              "consult_first_name",
              user.personalConsultant.first_name
            );
            localStorage.setItem(
              "consult_last_name",
              user.personalConsultant.last_name
            );
            localStorage.setItem("client", JSON.stringify(user.client));
          } else {
            localStorage.setItem("consult_first_name", "Financial");
            localStorage.setItem("consult_last_name", "Consultant");
            localStorage.setItem("client", "null");
          }
          localStorage.setItem("benefitdetail", "0");
          localStorage.setItem(
            "saving_tips_tags",
            JSON.stringify(user.saving_tips_tags)
          );
          if (this.platform.is("cordova")) {
            this.nativeStorage.getItem("profilePic").then((response) => {
              if (response == null) {
                this.authimage
                  .transform(localStorage.getItem("photo"))
                  .then(async (img: any) => {
                    await this.nativeStorage.setItem("profilePic", img);
                  });
              }
            });

            this.notifyBirthday();
          }
          resolve(getProfile);
        },
        async (error) => {
          this.loader.hide();
          await this.toast.danger("commonErrorMsg");
          this.authService.logout();
          reject(error);
        }
      );
    });
  }

  /**
   * Call Api using Put method
   * @param {string} url Api url Endpoint
   * @param {object} data Data Object to be passed in Api
   */
  putHttp(url, data): Observable<object> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });
    return this.httpclient.put(this.appconfig.url + url, data, {
      headers,
    });
  }

  /**
   * Call Api using Delete method
   * @param {string} url Api Url Endpoint
   */
  deleteHttp(url): Observable<object> {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    });
    return this.httpclient.delete(this.appconfig.url + url, {
      headers,
    });
  }

  /**
   * Upload file to server
   * @param url file upload url
   * @param data files for upload
   */
  postHttpFile(url, data): Promise<object> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      const headers = new HttpHeaders({
        Authorization: "Bearer " + token,
      });
      this.httpclient
        .post(url, data, {
          headers,
        })
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  /**
   * Local notitication to user for birthday
   */
  notifyBirthday(): void {
    this.localNotifications.hasPermission().then((response) => {
      if (response) {
        if (localStorage.getItem("isNotify") !== "true") {
          let birthday = localStorage.getItem("birthday");
          if (
            birthday !== null &&
            birthday !== "" &&
            birthday !== undefined &&
            birthday !== "null"
          ) {
            let day = new Date(birthday).getDate();
            let month = new Date(birthday).getMonth() + 1;
            this.translateService
              .get("birthdayTitle")
              .subscribe(async (translatedstring) => {
                this.birthdayTitle = translatedstring;
              });
            this.translateService
              .get("birthdayDesc")
              .subscribe(async (translatedstring) => {
                this.birthdayDesc = translatedstring;
              });
            let notifications;
            if (this.platform.is("ios")) {
              notifications = {
                id: 1,
                title: this.birthdayTitle,
                text: this.birthdayDesc,
                trigger: {
                  every: { month: month, day: day, hour: 9, minute: 0 },
                  count: 1,
                },
                foreground: true,
              };
            }
            if (this.platform.is("android")) {
              notifications = {
                id: 1,
                title: this.birthdayTitle,
                text: this.birthdayDesc,
                // color: '#268A8D',
                trigger: {
                  every: { month: month, day: day, hour: 9, minute: 0 },
                  count: 1,
                },
                foreground: true,
              };
            }
            this.localNotifications.schedule(notifications);
          }
        }
      }
    });
  }
}
