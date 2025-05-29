import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleDto, RolesService } from '@proxy/system/roles';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
})
export class RoleDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel: boolean = false;
  btnDisabled = false;
  public saveBtnName: string;
  public closeBtnName: string;
  public form: FormGroup;

  selectedEntity = {} as RoleDto;

  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private config: DynamicDialogConfig,
    private utilityService: UtilityService,
    private notificationService: NotificationService,
    public ref: DynamicDialogRef
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.buildForm();
    if (this.utilityService.isEmpty(this.config.data?.id) == false) {
      this.loadDetail(this.config.data.id);
      this.saveBtnName = 'Cập nhật';
      this.closeBtnName = 'Hủy';
    } else {
      this.toggleBlockUI(false);
      this.saveBtnName = 'Thêm';
      this.closeBtnName = 'Đóng';
    }
  }

  loadDetail(id: any) {
    this.toggleBlockUI(true);
    this.roleService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (result: RoleDto) => {
          this.selectedEntity = result;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  // Validate
  noSpecial: RegExp = /^[^<>*!_~]+$/;
  validationMessages = {
    name: [
      { type: 'required', message: 'Bạn phải nhập tên nhóm' },
      { type: 'minlength', message: 'Bạn phải nhập ít nhất 3 kí tự' },
      { type: 'maxlength', message: 'Bạn không được nhập quá 255 kí tự' },
    ],
    description: [{ type: 'required', message: 'Bạn phải mô tả' }],
  };

  saveChange() {
    this.toggleBlockUI(true);
    if (this.utilityService.isEmpty(this.config.data?.id) == true) {
      this.roleService
        .create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (result: RoleDto) => {
            this.toggleBlockUI(false);
            this.ref.close(result);
          },
          error: err => {
            this.toggleBlockUI(false);
          },
        });
    } else {
      this.roleService
        .update(this.config.data.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (result: RoleDto) => {
            this.toggleBlockUI(false);
            this.ref.close(result);
          },
          error: err => {
            this.toggleBlockUI(false);
          },
        });
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      name: new FormControl(
        this.selectedEntity.name || null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.minLength(3),
        ])
      ),
      description: new FormControl(this.selectedEntity.description || null),
    });
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
