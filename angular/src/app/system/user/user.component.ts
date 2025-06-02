import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInListDto, UsersService } from '@proxy/system/users';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserDetailComponent } from './user-detail.component';
import { RoleAssignComponent } from './role-assign.component';
import { SetPasswordComponent } from './set-password.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: UserInListDto[] = [];
  selectedItems: UserInListDto[] = [];

  // Paging variable
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  productCategories: any[] = [];
  keyword: string = '';
  categoryId: string = '';

  constructor(
    private userService: UsersService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.toggleBlockUI(true);
    this.userService
      .getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.items = result.items;
        this.totalCount = result.totalCount;
        this.toggleBlockUI(false);
      });
  }
  showAddModal() {
    const ref = this.dialogService.open(UserDetailComponent, {
      header: 'Thêm người dùng',
      width: '70%',
    });
    ref.onClose.subscribe((result: UserInListDto) => {
      if (result) {
        this.loadData();
        this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }

    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(UserDetailComponent, {
      header: 'Chỉnh sửa người dùng',
      width: '70%',
      data: { id: id },
    });
    ref.onClose.subscribe((result: UserInListDto) => {
      if (result) {
        this.loadData();
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }

    var ids = [];
    this.selectedItems.forEach(item => {
      ids.push(item.id);
    });

    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      header: 'Xác nhận',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItemsConfirm(ids);
      },
      reject: () => {},
    });
  }

  deleteItemsConfirm(ids: string[]) {
    this.toggleBlockUI(true);
    this.userService
      .deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadData();
          this.selectedItems = [];
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  assignRole(id) {
    const ref = this.dialogService.open(RoleAssignComponent, {
      header: 'Phân quyền',
      width: '70%',
      data: { id: id },
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
      }
    });
  }

  setPassword(id) {
    const ref = this.dialogService.open(SetPasswordComponent, {
      header: 'Đặt mật khẩu',
      width: '70%',
      data: { id: id },
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
      }
    });
  }

  pageChanged(event: any): void {
    this.skipCount = (event.pageCount - 1) * this.maxResultCount;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
