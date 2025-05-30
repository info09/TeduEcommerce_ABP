import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManufacturerInListDto, ManufacturersService } from '@proxy/catalog/manufacturers';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ManufacturerDetailComponent } from './manufacturer-detail.component';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
})
export class ManufacturerComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: ManufacturerInListDto[] = [];
  selectedItems: ManufacturerInListDto[] = [];

  // Paging variable
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  productCategories: any[] = [];
  keyword: string = '';
  categoryId: string = '';

  /**
   *
   */
  constructor(
    private manufacturerService: ManufacturersService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  loadData() {
    this.toggleBlockUI(true);
    this.manufacturerService
      .getListFilter({
        keyword: this.keyword,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.items = result.items;
        this.totalCount = result.totalCount;
        this.toggleBlockUI(false);
      });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  showAddModal() {
    const ref = this.dialogService.open(ManufacturerDetailComponent, {
      header: 'Thêm danh mục sản phẩm',
      width: '70%',
    });

    ref.onClose.subscribe({
      next: res => {
        if (res) {
          this.loadData();
        }
      },
    });
  }

  showEditModal() {
    if (this.selectedItems.length != 1) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(ManufacturerDetailComponent, {
      header: 'Sửa danh mục sản phẩm',
      width: '70%',
      data: {
        id: id,
      },
    });

    ref.onClose.subscribe({
      next: res => {
        if (res) {
          this.loadData();
        }
      },
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
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItemsConfirm(ids);
      },
    });
  }

  deleteItemsConfirm(ids: string[]) {
    this.toggleBlockUI(true);
    this.manufacturerService
      .deleteMultipleByIds(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadData();
          this.selectedItems = [];
        },
        error: () => {
          this.toggleBlockUI(false);
          this.notificationService.showError(MessageConstants.DELETED_ERR_MSG);
        },
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
