import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoleDto, RoleInListDto, RolesService } from '@proxy/system/roles';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RoleDetailComponent } from './role-detail.component';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { ConfirmationService } from 'primeng/api';
import { PermissionGrantComponent } from './permission-grant.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
})
export class RoleComponent implements OnInit, OnDestroy {
  // Component logic goes here
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: RoleInListDto[] = [];
  selectedItems: RoleInListDto[] = [];

  // Paging variable
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  productCategories: any[] = [];
  keyword: string = '';
  categoryId: string = '';
  constructor(
    private roleService: RolesService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService
  ) {
    // Initialization code if needed
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(selectionId = null) {
    this.toggleBlockUI(true);
    this.roleService
      .getListFilter({
        keyword: this.keyword,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<RoleInListDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(RoleDetailComponent, {
      header: 'Thêm nhóm quyền',
      width: '70%',
    });
    ref.onClose.subscribe((result: RoleInListDto) => {
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
    const ref = this.dialogService.open(RoleDetailComponent, {
      header: 'Chỉnh sửa nhóm quyền',
      width: '70%',
      data: { id: id },
    });
    ref.onClose.subscribe((result: RoleInListDto) => {
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
    this.roleService
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

  showPermissionModal(id: string, name: string) {
    const ref = this.dialogService.open(PermissionGrantComponent, {
      data: {
        id: id,
        name: name,
      },
      header: name,
      width: '70%',
    });

    ref.onClose.subscribe((data: RoleDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.loadData(data.id);
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
