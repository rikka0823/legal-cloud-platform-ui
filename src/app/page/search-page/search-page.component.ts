import { SearchSessionService } from './../../service/search-session.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectItemGroup } from 'primeng/api';
import { InputSearchData } from '../../service/search-session.service';
import { Router } from '@angular/router';
import { Checkbox } from 'primeng/checkbox';
import Swal from 'sweetalert2';
import { SessionServiceService } from '../../service/session-service.service';
import { HttpClientService } from '../../service/http-client.service';
import { isPlatformBrowser } from '@angular/common';



@Component({
  selector: 'app-search-page',
  imports: [
    MatIconModule,
    MatExpansionModule,
    AccordionModule,
    AvatarModule,
    BadgeModule,
    InputTextModule,
    FormsModule,
    MultiSelectModule,
    Checkbox
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent {


  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在
  readonly panelOpenState = signal(false);

  keywords: string = '';
  inputCase: string = '';
  law: string = '';
  lawList!: string[];
  lawType!: string[];
  groupedCourts!: SelectItemGroup[];
  inputCourts!: string[];
  inputCaseYear: string = '';
  startDate!: Date;
  endDate!: Date;
  caseType: string = '';
  year: string = '';
  zhi: string = '';
  hao: string = '';
  combinedId: string = '';

  userName !: string;
  userRole !: string;

  isExpanded: boolean = false;  // 進階條件是否展開的變數
  errorMessage: string = '';    // 法條錯誤提示訊息


  constructor(
    private searchSessionService: SearchSessionService,
    private router: Router,
    public session: SessionServiceService,
    private http: HttpClientService,
    private cdRef: ChangeDetectorRef
  ) {
    this.groupedCourts = [
      {
        label: '北部',
        value: 'N',
        items: [
          { label: '臺灣臺北地方法院', value: 'TPD' },
          { label: '臺灣新北地方法院', value: 'PCD' },
          { label: '臺灣士林地方法院', value: 'SLD' },
          { label: '臺灣桃園地方法院', value: 'TYD' },
          { label: '臺灣新竹地方法院', value: 'SCD' },
          { label: '臺灣基隆地方法院', value: 'KLD' },

        ]
      },
      {
        label: '中部',
        value: 'M',
        items: [
          { label: '臺灣苗栗地方法院', value: 'MLD' },
          { label: '臺灣臺中地方法院', value: 'TCD' },
          { label: '臺灣南投地方法院', value: 'NTD' },
          { label: '臺灣彰化地方法院', value: 'CHD' },
          { label: '臺灣雲林地方法院', value: 'ULD' },
        ]
      },
      {
        label: '南部',
        value: 'S',
        items: [
          { label: '臺灣嘉義地方法院', value: 'CYD' },
          { label: '臺灣臺南地方法院', value: 'TND' },
          { label: '臺灣橋頭地方法院', value: 'CTD' },
          { label: '臺灣高雄地方法院', value: 'KSD' },
          { label: '臺灣屏東地方法院', value: 'PTD' },
        ]
      },
      {
        label: '東部',
        value: 'E',
        items: [
          { label: '臺灣臺東地方法院', value: 'TTD' },
          { label: '臺灣花蓮地方法院', value: 'HLD' },
          { label: '臺灣宜蘭地方法院', value: 'ILD' },
        ]
      },
      {
        label: '離島',
        value: 'O',
        items: [
          { label: '臺灣澎湖地方法院', value: 'PHD' },
          { label: '福建連江地方法院', value: 'LCD' },
          { label: '福建金門地方法院', value: 'KMD' },
        ]
      },
    ];
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // 取得會員資訊
      const data = sessionStorage.getItem('userData') ? JSON.parse(sessionStorage.getItem('userData')!) : false;
      if (data) {
        this.userName = data.name === 'guest' ? '會員' : data.name; // 防止預設名稱顯示在畫面上
        this.userRole = data.role;
      }
    }
  }


  toggleAdvanced() {
    this.isExpanded = !this.isExpanded;
  }

  toChinese(role: string): string {
    return this.session.toChinese(role);
  }

  goCombinedId(): string {
    // 將三個輸入框的值合併成一個新值
    if (this.year) {
      this.combinedId = this.combinedId + `${this.year}年度`
    }
    if (this.zhi) {
      this.combinedId = this.combinedId + `${this.zhi}字`
    }
    if (this.hao) {
      this.combinedId = this.combinedId + `第${this.hao}號`
    }
    return this.combinedId;
  }


  // 驗證法條輸入內容
  validateInput(input: string): boolean {
    // 禁止特殊符號：僅允許中文、文字、數字及空白
    const regex = /^[^\s!@#$%^&*()_+\-=[\]{}':"\\|,.<>/?\uFF01-\uFF0F\uFF1A-\uFF5E]*$/;
    return regex.test(input);
  }

  // 更新法條列表
  updateLawsList() {
    if (this.validateInput(this.law)) {
      this.errorMessage = '';
      this.lawList = this.law.split(';').filter(law => law.trim() !== '');
    } else {
      this.errorMessage = '輸入內容不可有分號以外的特殊符號，請重新輸入';
    }
  }


  confirm() {
    const tidyData = {
      searchName: this.keywords,  // 模糊搜尋名
      verdictId: this.goCombinedId(), // 裁判字號 id
      caseType: (this.lawType || []).join(', '),  // 案件類型:刑法、民法等等
      charge: this.inputCase,	// 案由
      courtList: this.inputCourts,  // 法院
      lawList: this.lawList,  // 法條
      verdictStartDate: this.startDate, // 開始時間
      verdictEndDate: this.endDate, // 結束時間
      docType: this.caseType, // 文件類型:裁定、判決
    }

    // 將整理的資料暫存到 service
    this.searchSessionService.searchData = tidyData;
    console.log("存入的資料:", tidyData);
    this.router.navigate(['/search-result']);
  }

  goLogin() {
    this.router.navigateByUrl('/login')
  }

  goRegister() {
    this.router.navigateByUrl('/register')
  }

  goLogout() {
    Swal.fire({
      title: '登出確認',
      text: '確定要登出嗎？',
      icon: 'info',
      showCancelButton: true,   // 顯示取消按鈕
      confirmButtonText: '確定',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.postApi2('http://localhost:8080/accountSystem/logout', '').subscribe({
          next: (response: any) => {
            if (response.body.code != 200) {
              // 登出失敗
              Swal.fire({
                text: '登出失敗',
                icon: 'error',
                confirmButtonText: '確定'
              });
              return;
            }
          },
          error: (error) => {
            // 請求失敗
            Swal.fire({
              text: '登出失敗',
              icon: 'error',
              confirmButtonText: '確定'
            });
            return;
          }
        });
        // 用戶確認登出，執行登出操作
        Swal.fire({
          text: '您已成功登出。',
          icon: 'info',
          confirmButtonText: '關閉'
        });
        this.session.clearIsLogin();
        this.session.clearEmail();
        console.log(this.session.getIsLogin());
        // 手動觸發變更檢測，更新顯示登出狀態
        this.cdRef.detectChanges();
        this.router.navigateByUrl('/search')
        sessionStorage.removeItem('userData')
      }
    });
  }

  goAccountCenter() {
    this.router.navigateByUrl('/account-center')
  }

}







