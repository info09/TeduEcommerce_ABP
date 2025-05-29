import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ProductCategoriesService,
  ProductCategoryInListDto,
} from '@proxy/catalog/product-categories';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
})
export class ProductCategoryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  items: ProductCategoryInListDto[] = [];
  selectedItems: ProductCategoryInListDto[] = [];

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
  constructor(private productCategoryService: ProductCategoriesService) {}
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.toggleBlockUI(true);
    this.productCategoryService
      .getListFilter({
        keyword: this.keyword,
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {}

  showEditModal() {}

  deleteItems() {}

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
