import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManufacturerDto, ManufacturersService } from '@proxy/catalog/manufacturers';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-manufacturer-detail',
  templateUrl: './manufacturer-detail.component.html',
})
export class ManufacturerDetailComponent implements OnInit, OnDestroy {
  // Component logic goes here
  // This component is currently empty, but you can add properties and methods as needed.
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public form: FormGroup;
  public thumbnailImage;
  selectedEntity = {} as ManufacturerDto;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private utilService: UtilityService,
    private manufacturerService: ManufacturersService,
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
    this.manufacturerService
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
  };

  private buildForm() {
    this.form = this.fb.group({
      name: new FormControl(
        this.selectedEntity.name || null,
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ),
      code: new FormControl(this.selectedEntity.code || null, Validators.required),
      slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
      country: new FormControl(this.selectedEntity.country || null, Validators.required),
      visibility: new FormControl(this.selectedEntity.visibility || true),
      isActive: new FormControl(this.selectedEntity.isActive || true),
      coverPicture: new FormControl(this.selectedEntity.coverPicture || ''),
    });
  }

  generateSlug() {
    this.form.controls['slug'].setValue(this.utilService.MakeSeoTitle(this.form.get('name').value));
  }

  getNewSuggestionCode() {
    this.manufacturerService
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
      this.manufacturerService.create(this.form.value).subscribe({
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
      this.manufacturerService.update(this.config.data.id, this.form.value).subscribe({
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
