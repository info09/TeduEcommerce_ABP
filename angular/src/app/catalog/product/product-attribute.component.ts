import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';
import {
  ProductAttributeInListDto,
  ProductAttributesService,
} from '@proxy/catalog/product-attributes';
import { ProductsService } from '@proxy/catalog/products';
import { ProductAttributeType } from '@proxy/product-attributes';
import { ProductAttributeValueDto } from '@proxy/catalog/products/attributes';
import { MessageConstants } from 'src/app/shared/constants/messages.const';

@Component({
  selector: 'app-product-attribute',
  templateUrl: './product-attribute.component.html',
})
export class ProductAttributeComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;

  attributes: any[] = [];
  fullAttributes: any[] = [];
  productAttributes: any[] = [];
  showDateTimeControl: boolean = false;
  showDecimalControl: boolean = false;
  showIntControl: boolean = false;
  showVarcharControl: boolean = false;
  showTextControl: boolean = false;
  // Component logic goes here
  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private productAttributeService: ProductAttributesService,
    private productService: ProductsService,
    private confirmationService: ConfirmationService,
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
    this.initFormData();
  }

  initFormData() {
    var attributes = this.productAttributeService.getListAll();
    this.toggleBlockUI(true);
    forkJoin({ attributes })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.fullAttributes = response.attributes;
          var attributes = response.attributes as ProductAttributeInListDto[];
          attributes.forEach(element => {
            this.attributes.push({
              value: element.id,
              label: element.label,
            });
          });
          this.loadFormDetails(this.config.data?.id);
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  loadFormDetails(id: string) {
    this.toggleBlockUI(true);

    this.productService
      .getListProductAttributeAll(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.productAttributes = response;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: err => {
          console.error('Error loading product attribute details:', err);
          this.toggleBlockUI(false);
        },
      });
  }

  getDataTypeName(value: number) {
    return ProductAttributeType[value];
  }

  saveChange() {
    this.toggleBlockUI(true);
    this.productService
      .addProductAttribute(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.loadFormDetails(this.config.data.id);
        },
        error: err => {
          this.notificationService.showError(err.error.error.message);
          this.toggleBlockUI(false);
        },
      });
  }

  private buildForm() {
    this.form = this.fb.group({
      productId: new FormControl(this.config.data.id),
      attributeId: new FormControl(null, Validators.required),
      dateTimeValue: new FormControl(null),
      decimalValue: new FormControl(null),
      intValue: new FormControl(null),
      varcharValue: new FormControl(null),
      textValue: new FormControl(null),
    });
  }

  removeItem(attribute: ProductAttributeValueDto) {
    var id = '';
    if (attribute.dataType == ProductAttributeType.Date) {
      id = attribute.dateTimeId;
    } else if (attribute.dataType == ProductAttributeType.Decimal) {
      id = attribute.decimalId;
    } else if (attribute.dataType == ProductAttributeType.Int) {
      id = attribute.intId;
    } else if (attribute.dataType == ProductAttributeType.Text) {
      id = attribute.textId;
    } else if (attribute.dataType == ProductAttributeType.Varchar) {
      id = attribute.varcharId;
    }
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteItemsConfirmed(attribute, id);
      },
    });
  }

  deleteItemsConfirmed(attribute: ProductAttributeValueDto, id: string) {
    this.toggleBlockUI(true);
    this.productService
      .removeProductAttribute(attribute.attributeId, id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
          this.loadFormDetails(this.config.data?.id);
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  selectAttribute(event: any) {
    var dataType = this.fullAttributes.filter(x => x.id == event.value)[0].dataType;
    this.showDateTimeControl = false;
    this.showDecimalControl = false;
    this.showIntControl = false;
    this.showTextControl = false;
    this.showVarcharControl = false;
    if (dataType == ProductAttributeType.Date) {
      this.showDateTimeControl = true;
    } else if (dataType == ProductAttributeType.Decimal) {
      this.showDecimalControl = true;
    } else if (dataType == ProductAttributeType.Int) {
      this.showIntControl = true;
    } else if (dataType == ProductAttributeType.Text) {
      this.showTextControl = true;
    } else if (dataType == ProductAttributeType.Varchar) {
      this.showVarcharControl = true;
    }
  }

  getValueByType(attribute: ProductAttributeValueDto, value: number) {
    if (attribute.dataType == ProductAttributeType.Date) {
      return attribute.dateTimeValue;
    } else if (attribute.dataType == ProductAttributeType.Decimal) {
      return attribute.decimalValue;
    } else if (attribute.dataType == ProductAttributeType.Int) {
      return attribute.intValue;
    } else if (attribute.dataType == ProductAttributeType.Text) {
      return attribute.textValue;
    } else if (attribute.dataType == ProductAttributeType.Varchar) {
      return attribute.varcharValue;
    }
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
