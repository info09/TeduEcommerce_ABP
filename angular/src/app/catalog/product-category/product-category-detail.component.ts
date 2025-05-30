import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductCategoriesService, ProductCategoryDto } from '@proxy/catalog/product-categories';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-product-category-detail',
  templateUrl: './product-category-detail.component.html',
})
export class ProductCategoryDetailComponent implements OnInit, OnDestroy {
  // Component logic goes here
  // This component is currently empty, but you can add properties and methods as needed.
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;
  public thumbnailImage;
  selectedEntity = {} as ProductCategoryDto;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private utilService: UtilityService,
    private productCategoryService: ProductCategoriesService,
    private notificationService: NotificationService,
    private ref: DynamicDialogRef
  ) {}
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.buildForm();
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.getNewSuggestionCode();
      this.toggleBlockUI(false);
    } else {
      this.loadDetail(this.config.data?.id);
    }
  }

  loadDetail(id) {
    this.toggleBlockUI(true);
    this.productCategoryService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.toggleBlockUI(false);
        this.selectedEntity = res;
        this.buildForm();
      });
  }

  validationMessages = {
    code: [{ type: 'required', message: 'Bạn phải nhập mã duy nhất' }],
    name: [
      { type: 'required', message: 'Bạn phải nhập tên' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    slug: [{ type: 'required', message: 'Bạn phải URL duy nhất' }],
    sortOrder: [{ type: 'required', message: 'Bạn phải nhập thứ tự' }],
    sellPrice: [{ type: 'required', message: 'Bạn phải nhập giá bán' }],
  };

  private buildForm() {
    this.form = this.fb.group({
      name: new FormControl(
        this.selectedEntity.name || null,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      code: new FormControl(this.selectedEntity.code || null, Validators.required),
      slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
      sortOrder: new FormControl(this.selectedEntity.sortOrder || null, Validators.required),
      visibility: new FormControl(this.selectedEntity.visibility || true),
      isActive: new FormControl(this.selectedEntity.isActive || true),
      seoMetaDescription: new FormControl(this.selectedEntity.seoMetaDescription || null),
      coverPicture: new FormControl(this.selectedEntity.coverPicture || ''),
    });
  }

  generateSlug() {
    this.form.controls['slug'].setValue(this.utilService.MakeSeoTitle(this.form.get('name').value));
  }

  getNewSuggestionCode() {
    this.productCategoryService
      .getSuggestNewCode()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: string) => {
          this.form.patchValue({
            code: response,
          });
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    if (this.utilService.isEmpty(this.config.data?.id) == true) {
      this.productCategoryService.create(this.form.value).subscribe({
        next: res => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
          this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
    } else {
      this.productCategoryService.update(this.config.data.id, this.form.value).subscribe({
        next: res => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
          this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        },
        error: err => {
          this.toggleBlockUI(false);
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
