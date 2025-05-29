import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ProductAttributeInListDto,
  ProductAttributesService,
  ProductAttributeType,
} from '@proxy/product-attributes';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { AttributeDetailComponent } from './attribute-detail.component';
import { NotificationService } from '../shared/services/notification.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
})
export class AttributeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: ProductAttributeInListDto[] = [];
  selectedItems: ProductAttributeInListDto[] = [];

  // Paging variable
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  productCategories: any[] = [];
  keyword: string = '';
  categoryId: string = '';
  // Component logic goes here
  constructor(
    private productAttributeService: ProductAttributesService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
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

  loadData() {
    this.toggleBlockUI(true);
    this.productAttributeService
      .getListFilter({
        keyword: this.keyword,
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: PagedResultDto<ProductAttributeInListDto>) => {
          this.items = result.items;
          this.totalCount = result.totalCount;
          this.toggleBlockUI(false);
        },
        error: error => {
          console.error('Error loading data', error);
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(AttributeDetailComponent, {
      header: 'Thêm thuộc tính mới',
      width: '70%',
    });

    ref.onClose.subscribe((result: ProductAttributeInListDto) => {
      if (result) {
        this.loadData();
        this.notificationService.showSuccess('Thêm thuộc tính thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length != 1) {
      this.notificationService.showError('Bạn phải chọn một thuộc tính để sửa');
      return;
    }
    const ref = this.dialogService.open(AttributeDetailComponent, {
      header: 'Chỉnh sửa thuộc tính',
      width: '70%',
      data: {
        id: this.selectedItems[0].id,
      },
    });

    ref.onClose.subscribe((result: ProductAttributeInListDto) => {
      if (result) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thuộc tính thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError('Bạn chưa chọn thuộc tính nào để xóa');
      return;
    }

    var ids = [];
    this.selectedItems.forEach(item => {
      ids.push(item.id);
    });

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các thuộc tính đã chọn?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItemsConfirm(ids);
      },
    });
  }

  deleteItemsConfirm(ids: string[]) {
    this.toggleBlockUI(true);
    this.productAttributeService
      .deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.loadData();
          this.notificationService.showSuccess('Xóa thuộc tính thành công');
          this.selectedItems = [];
        },
        error: error => {
          console.error('Error deleting items', error);
          this.toggleBlockUI(false);
        },
      });
  }

  getAttributeTypeName(value: number) {
    return ProductAttributeType[value];
  }

  pageChanged(event: any): void {
    this.skipCount = (event.page - 1) * this.maxResultCount;
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
