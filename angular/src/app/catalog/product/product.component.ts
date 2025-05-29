import { PagedResultDto } from '@abp/ng.core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import { ProductDetailComponent } from './product-detail.component';
import { ConfirmationService } from 'primeng/api';
import { ProductAttributeComponent } from './product-attribute.component';
import { ProductDto, ProductInListDto, ProductsService } from '@proxy/catalog/products';
import {
  ProductCategoriesService,
  ProductCategoryInListDto,
} from '@proxy/catalog/product-categories';
import { ProductType } from '@proxy/products';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: ProductInListDto[] = [];
  selectedItems: ProductInListDto[] = [];

  // Paging variable
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount: number;

  //Filter
  productCategories: any[] = [];
  keyword: string = '';
  categoryId: string = '';

  constructor(
    private productService: ProductsService,
    private productCategoriesService: ProductCategoriesService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.loadData();
    this.loadProductCategories();
  }

  loadData() {
    this.toggleBlockUI(true);
    this.productService
      .getListFilter({
        keyword: this.keyword,
        categoryId: this.categoryId,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<ProductInListDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  loadProductCategories() {
    this.toggleBlockUI(true);
    this.productCategoriesService
      .getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: ProductCategoryInListDto[]) => {
          res.forEach(item => {
            this.productCategories.push({
              label: item.name,
              value: item.id,
            });
          });
          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(ProductDetailComponent, {
      header: 'Thêm mới sản phẩm',
      width: '70%',
    });

    ref.onClose.subscribe((data: ProductDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm mới sản phẩm thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError('Bạn phải chọn ít nhất một sản phẩm để chỉnh sửa');
      return;
    }
    const id = this.selectedItems[0].id;
    const ref = this.dialogService.open(ProductDetailComponent, {
      header: 'Chỉnh sửa sản phẩm',
      width: '70%',
      data: {
        id: id,
      },
    });

    ref.onClose.subscribe((data: ProductDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Chỉnh sửa sản phẩm thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError('Bạn phải chọn ít nhất một sản phẩm để xóa');
      return;
    }
    var ids = [];
    this.selectedItems.forEach(item => {
      ids.push(item.id);
    });
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteItemsConfirm(ids);
      },
    });
  }

  deleteItemsConfirm(ids: string[]) {
    this.toggleBlockUI(true);
    this.productService
      .deleteMultipleByIds(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.notificationService.showSuccess('Xóa sản phẩm thành công');
          this.loadData();
          this.selectedItems = [];
        },
        error: () => {
          this.toggleBlockUI(false);
          this.notificationService.showError('Xóa sản phẩm không thành công');
        },
      });
  }

  manageProductAttribute(id: string) {
    const ref = this.dialogService.open(ProductAttributeComponent, {
      header: 'Quản lý thuộc tính sản phẩm',
      width: '70%',
      data: {
        id: id,
      },
    });

    ref.onClose.subscribe((data: ProductDto) => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thuộc tính sản phẩm thành công');
        this.selectedItems = [];
      }
    });
  }

  getProductTypeName(value: number) {
    return ProductType[value];
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
