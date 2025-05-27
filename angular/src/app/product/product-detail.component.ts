import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategoriesService, ProductCategoryInListDto } from '@proxy/product-categories';
import { ProductDto, ProductsService } from '@proxy/products';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;

  public form: FormGroup;

  //Dropdown
  productCategories: any[] = [];
  manufacturers: any[] = [];
  productTypes: any[] = [];

  selectedEntity = {} as ProductDto;

  constructor(
    private productsService: ProductsService,
    private productCategoriesService: ProductCategoriesService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.buildForm();
  }

  loadFormDetail(id: string) {
    this.toggleBlockUI(true);
    this.productsService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: ProductDto) => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
          console.error('Error loading product detail:', err);
        },
      });
  }

  loadProductCategories() {
    this.productCategoriesService.getListAll().subscribe({
      next: (res: ProductCategoryInListDto[]) => {
        res.forEach(item => {
          this.productCategories.push({
            label: item.name,
            value: item.id,
          });
        });
      },
      error: err => {
        console.error('Error loading product categories:', err);
      },
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      name: new FormControl(this.selectedEntity.name || null, Validators.required),
      code: new FormControl(this.selectedEntity.code || null, Validators.required),
      slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
      sku: new FormControl(this.selectedEntity.sku || null, Validators.required),
      manufacturerId: new FormControl(
        this.selectedEntity.manufacturerId || null,
        Validators.required
      ),
      categoryId: new FormControl(this.selectedEntity.categoryId || null, Validators.required),
      productType: new FormControl(this.selectedEntity.productType || null, Validators.required),
      sortOrder: new FormControl(this.selectedEntity.sortOrder || null, Validators.required),
      sellPrice: new FormControl(this.selectedEntity.sellPrice || null, Validators.required),
      visibility: new FormControl(this.selectedEntity.visibility || null, Validators.required),
      isActive: new FormControl(this.selectedEntity.isActive || null, Validators.required),
      seoMetaDescription: new FormControl(
        this.selectedEntity.seoMetaDescription || null,
        Validators.required
      ),
      description: new FormControl(this.selectedEntity.description || null),
    });
  }

  saveChange() {}

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
