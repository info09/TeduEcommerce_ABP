import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategoriesService, ProductCategoryInListDto } from '@proxy/product-categories';
import { ProductDto, ProductsService, productTypeOptions } from '@proxy/products';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { UtilityService } from '../shared/services/utility.service';
import { ManufacturerInListDto, ManufacturersService } from '@proxy/manufacturers';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;

  public form: FormGroup;

  //Dropdown
  productCategories: any[] = [];
  manufacturers: any[] = [];
  productTypes: any[] = [];

  selectedEntity = {} as ProductDto;

  constructor(
    private productsService: ProductsService,
    private productCategoriesService: ProductCategoriesService,
    private manufacturersService: ManufacturersService,
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private notificationService: NotificationService
  ) {}

  validationMessages = {
    code: [{ type: 'required', message: 'Bạn phải nhập mã duy nhất' }],
    name: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    slug: [{ type: 'required', message: 'Bạn phải URL duy nhất' }],
    sku: [{ type: 'required', message: 'Bạn phải mã SKU sản phẩm' }],
    manufacturerId: [{ type: 'required', message: 'Bạn phải chọn nhà cung cấp' }],
    categoryId: [{ type: 'required', message: 'Bạn phải chọn danh mục' }],
    productType: [{ type: 'required', message: 'Bạn phải chọn loại sản phẩm' }],
    sortOrder: [{ type: 'required', message: 'Bạn phải nhập thứ tự' }],
    sellPrice: [{ type: 'required', message: 'Bạn phải nhập giá bán' }],
  };

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.buildForm();
    this.loadProductTypes();
    this.initFormData();
  }

  initFormData() {
    var productCategories = this.productCategoriesService.getListAll();
    var manufacturers = this.manufacturersService.getListAll();
    this.toggleBlockUI(true);
    forkJoin({
      productCategories,
      manufacturers,
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          var productCategories = res.productCategories as ProductCategoryInListDto[];
          var manufacturers = res.manufacturers as ManufacturerInListDto[];
          productCategories.forEach(item => {
            this.productCategories.push({
              label: item.name,
              value: item.id,
            });
          });

          manufacturers.forEach(item => {
            this.manufacturers.push({
              label: item.name,
              value: item.id,
            });
          });

          if (this.utilityService.isEmpty(this.config.data?.id) == true) {
            this.toggleBlockUI(false);
          } else {
            this.loadFormDetails(this.config.data?.id);
          }
        },
      });
  }

  loadFormDetails(id: string) {
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

  generateSlug() {
    this.form.controls['slug'].setValue(
      this.utilityService.MakeSeoTitle(this.form.controls['name'].value)
    );
  }

  private buildForm() {
    this.form = this.fb.group({
      name: new FormControl(
        this.selectedEntity.name || null,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
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
      visibility: new FormControl(this.selectedEntity.visibility || true),
      thumbnailPicture: new FormControl(this.selectedEntity.thumbnailPicture || ''),
      isActive: new FormControl(this.selectedEntity.isActive || true),
      seoMetaDescription: new FormControl(this.selectedEntity.seoMetaDescription || null),
      description: new FormControl(this.selectedEntity.description || null),
    });
  }

  loadProductTypes() {
    productTypeOptions.forEach(item => {
      this.productTypes.push({
        label: item.key,
        value: item.value,
      });
    });
  }

  saveChange() {
    this.toggleBlockUI(true);
    if (this.utilityService.isEmpty(this.config.data?.id) == true) {
      this.productsService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.btnDisabled = false;
            this.ref.close(this.form.value);
          },
          error: err => {
            this.toggleBlockUI(false);
            console.error('Error creating product:', err);
          },
        });
    } else {
      this.productsService
        .update(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.btnDisabled = false;
            this.ref.close(this.form.value);
          },
          error: err => {
            this.toggleBlockUI(false);
            console.error('Error updating product:', err);
          },
        });
    }
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
