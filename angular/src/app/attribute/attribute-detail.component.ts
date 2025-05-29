import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ProductAttributeDto,
  ProductAttributesService,
  productAttributeTypeOptions,
} from '@proxy/product-attributes';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UtilityService } from '../shared/services/utility.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'app-attribute-detail',
  templateUrl: './attribute-detail.component.html',
})
export class AttributeDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  dataTypes: any[] = [];
  selectedEntity = {} as ProductAttributeDto;

  validationMessages = {
    code: [{ type: 'required', message: 'Bạn phải nhập mã duy nhất' }],
    label: [
      { type: 'required', message: 'Bạn phải nhập nhãn hiển thị' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    dataType: [{ type: 'required', message: 'Bạn phải chọn kiểu dữ liệu' }],
    sortOrder: [{ type: 'required', message: 'Bạn phải nhập thứ tự' }],
  };

  // Component logic goes here
  constructor(
    private fb: FormBuilder,
    private productAttributeService: ProductAttributesService,
    private config: DynamicDialogConfig,
    private utilityService: UtilityService,
    private ref: DynamicDialogRef,
    private notificationService: NotificationService
  ) {
    // Initialization code if needed
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.buildForm();
    this.loadAttributeTypes();
    this.initForm();
  }

  initForm() {
    if (this.utilityService.isEmpty(this.config.data?.id) == true) {
      this.toggleBlockUI(false);
    } else {
      this.loadFormDetail(this.config.data.id);
    }
  }

  loadFormDetail(id: string) {
    this.toggleBlockUI(true);
    this.productAttributeService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: ProductAttributeDto) => {
          this.selectedEntity = result;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: error => {
          console.error('Error loading attribute details:', error);
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    if (this.utilityService.isEmpty(this.config.data?.id) == true) {
      this.productAttributeService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (result: ProductAttributeDto) => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: error => {
            console.error('Error creating attribute:', error);
            this.toggleBlockUI(false);
          },
        });
    } else {
      this.productAttributeService
        .update(this.config.data.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (result: ProductAttributeDto) => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: error => {
            console.error('Error updating attribute:', error);
            this.toggleBlockUI(false);
          },
        });
    }
    this.toggleBlockUI(false);
  }

  loadAttributeTypes() {
    productAttributeTypeOptions.forEach(item => {
      this.dataTypes.push({
        label: item.key,
        value: item.value,
      });
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      label: new FormControl(
        this.selectedEntity.label || null,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      code: new FormControl(this.selectedEntity.code || null, Validators.required),
      dataType: new FormControl(this.selectedEntity.dataType || null, Validators.required),
      sortOrder: new FormControl(this.selectedEntity.sortOrder || null, Validators.required),
      visibility: new FormControl(this.selectedEntity.visibility || true),
      isActive: new FormControl(this.selectedEntity.isActive || true),
      note: new FormControl(this.selectedEntity.note || null),
      isRequired: new FormControl(this.selectedEntity.isRequired || true),
      isUnique: new FormControl(this.selectedEntity.isUnique || false),
    });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 1000);
    }
  }
}
