import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-members-management',
  imports: [
    CommonModule,
    PaginatorModule
  ],
  templateUrl: './members-management.component.html',
  styleUrl: './members-management.component.scss'
})
export class MembersManagementComponent {

  ngOnInit(): void {
    this.totalRecords = this.members.length; // 初始化總筆數
    this.updateVisibleCases(); // 初始化顯示的資料
  }

  members = [
    { id: 1, name: '王大明', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 8, clients: 8, status: '放假'},
    { id: 2, name: '王大湳', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 2, clients: 2, status: '接案'},
    { id: 3, name: '王大梅', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 6, clients: 6, status: '接案'},
    { id: 4, name: '王大立', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 9, clients: 9, status: '未接案'},
    { id: 5, name: '王大千', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 8, clients: 8, status: '放假'},
    { id: 6, name: '王大至', phone: '0912345678', email: 'fffgggg@hhhrrrr', cases: 5, clients: 5, status: '未接案'}
  ];

  // 頁籤
  itemsPerPage: number = 10; // 每頁顯示的筆數
  totalRecords: number = 0; // 總筆數
  first: number = 0; // 當前的起始那一筆的索引
  visibleCases: any[] = []; // 當前頁面顯示的案件數據

  onPageChange(event: any): void {
    this.first = event.first; // 更新起始那一筆的索引
    this.itemsPerPage = event.rows; // 更新每頁筆數
    this.updateVisibleCases(); // 更新顯示的筆數
  }

  // 更新顯示資料
  updateVisibleCases(): void {
    const start = this.first;   // 更新起始的那一筆的 index
    const end = this.first + this.itemsPerPage;   // 更新結束的那一筆的 index
    this.visibleCases = this.members.slice(start, end);    // 只取該頁要顯示的筆數的 index
  }
  
}
