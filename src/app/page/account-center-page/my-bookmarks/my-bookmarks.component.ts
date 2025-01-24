import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollTop } from 'primeng/scrolltop';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SessionServiceService } from '../../../service/session-service.service';
import { HttpClientService } from '../../../service/http-client.service';
import Swal from 'sweetalert2';
import { ClickDialogComponent } from '../../view-full-text-page/click-dialog/click-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-my-bookmarks',
  imports: [MatTabsModule, MatIconModule, ScrollTop, CommonModule, MatTooltipModule],
  templateUrl: './my-bookmarks.component.html',
  styleUrl: './my-bookmarks.component.scss',
})
export class MyBookmarksComponent implements OnInit {
  constructor(
    private router: Router,
    protected sessionServiceService: SessionServiceService,
    private http: HttpClientService,
    public dialog: MatDialog,
  ) { }

  private readonly platformId = inject(PLATFORM_ID); // 確保程式碼在瀏覽器上執行與 sessionStorage 存在


  email!: any;

  // 螢光筆書籤容器
  apiResponse: any[] = [];

  // 書籤容器
  myBookmarks: any[] = [];


  ngOnInit(): void {
    this.email = this.sessionServiceService.getEmail();
    this.getBookmarksApi(this.email);
    this.getHighlightersApi(this.email);
    // 嘗試從 sessionStorage 取得已儲存的 tab index
    const savedTabIndex = sessionStorage.getItem('selectedTab');
    if (savedTabIndex !== null) {
      this.selectedTabIndex = +savedTabIndex; // 轉換為數字
    }
  }

  checkContent(groupId: string, id: string, court: string) {
    this.router.navigateByUrl(
      'full-text/' + groupId + '&id=' + id + '&court=' + court
    );
    this.sessionServiceService.url = this.router.url;
  }

  //==============================================================================
  // api
  // 取得該email的所有儲存書籤
  getBookmarksApi(email: string) {
    this.http
      .getApi(
        'http://localhost:8080/accountSystem/email-all-bookmark?email=' + email
      )
      .subscribe((res: any) => {
        // 如果螢光筆資料庫沒有資料直接回傳
        if (res === null) return;
        console.log(res);
        // 處理書籤資料（直接賦值即可，因為資料結構與模板已匹配）
        const bookmarksList = res.bookmarkList;

        // 賦值給 myBookmarks
        this.myBookmarks = bookmarksList;

        // Debug: 顯示結果
        // console.log(this.myBookmarks);

      });
  }


  // 觸發刪除書籤方法
  toggleRemoveBookmark(bookmark: any) {
    const email = this.sessionServiceService.getEmail();
    const groupId = bookmark.group_id;
    const id = bookmark.id;
    const court = bookmark.court;

    this.removeBookmarkApi(email, groupId, id, court);

  }

  // 刪除書籤
  removeBookmarkApi(email: string, groupId: string, id: string, court: string) {
    // 將變數組裝成物件
    const deleteBookmark = { email, groupId, id, court };
    console.log("刪除的書籤", deleteBookmark)
    this.http.postApi('http://localhost:8080/accountSystem/delete-bookmark', deleteBookmark).subscribe({
      next: (res: any) => {
        if (res.code == 200) {
          Swal.fire({
            title: '書籤已刪除!',
            icon: 'success',
            confirmButtonText: '確定',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload(); // 在按下「確定」後執行刷新
            }
          });
        }
        if (res.code != 200) {
          Swal.fire({
            title: '刪除失敗',
            icon: 'error',
            confirmButtonText: '再試一次'
          });
          console.log(res);
        }
      },
      error: (error: any) => {
        Swal.fire({
          title: '刪除失敗',
          icon: 'error',
          confirmButtonText: '再試一次'
        });
      },
    })
  }


  // 打開通知對話框
  openDialog(message: string): void {
    this.dialog.open(ClickDialogComponent, {
      data: { message }
    });
  }


  // 取得該email的所有螢光筆書籤
  getHighlightersApi(email: string) {
    this.http
      .getApi(
        'http://localhost:8080/accountSystem/email-all-highlighte?email=' +
        email
      )
      .subscribe((res: any) => {
        // 如果螢光筆資料庫沒有資料直接回傳
        if (res === null) return;
        // 提取 highlighteList
        const highlighteList = res.highlighteList;

        // 轉換資料格式
        const groupedData = highlighteList.reduce((acc: any, item: any) => {
          // 找到對應 groupId 的群組
          let group = acc.find((g: any) => g.groupId === item.group_id);

          // 如果群組不存在，新增一個
          if (!group) {
            group = {
              groupId: item.group_id,
              id: item.id,
              court: item.court,
              content: [],
            };
            acc.push(group);
          }

          // 加入高亮細節到群組的 content
          group.content.push({
            startOffset: item.start_offset,
            endOffset: item.end_offset,
            text: item.Select_text,
            color: item.highlighter_color,
          });

          return acc;
        }, []);

        // 賦值給 apiResponse
        this.apiResponse = groupedData;

        // Debug: 顯示結果
        console.log(this.apiResponse);
      });
  }

  // 觸發刪除書籤方法
  toggleRemoveHighlighter(highlight: any) {
    const email = this.sessionServiceService.getEmail();
    const groupId = highlight.groupId;
    const id = highlight.id;
    const court = highlight.court;

    this.postDeleteHighlighterApi(email, groupId, id, court);

  }

  // 刪除螢光筆
  postDeleteHighlighterApi(email: string, groupId: string, id: string, court: string) {
    const DeleteHighlighter = { email, groupId, id, court };
    console.log(DeleteHighlighter);
    this.http.postApi('http://localhost:8080/accountSystem/delete-highlighte', DeleteHighlighter).subscribe({
      next: (res: any) => {
        if (res.code == 200) {
          Swal.fire({
            title: '螢光筆已刪除!',
            icon: 'success',
            confirmButtonText: '確定',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload(); // 在按下「確定」後執行刷新
            }
          });
        }
        if (res.code != 200) {
          Swal.fire({
            title: '刪除失敗',
            icon: 'error',
            confirmButtonText: '再試一次'
          });
          console.log(res);
        }
      },
      error: (error: any) => {
        Swal.fire({
          title: '刪除失敗',
          icon: 'error',
          confirmButtonText: '再試一次'
        });
      },
    })
  }

  selectedTabIndex: number = 0; // 預設為第一個 tab

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    sessionStorage.setItem('selectedTab', index.toString()); // 儲存 tab index
  }


}




