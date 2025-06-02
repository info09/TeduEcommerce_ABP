import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { RoleDto, RolesService } from '@proxy/system/roles';
import { UserDto, UsersService } from '@proxy/system/users';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-role-assign',
  templateUrl: './role-assign.component.html',
})
export class RoleAssignComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  // Default
  public blockedPanelDetail: boolean = false;
  public title: string;
  public btnDisabled = false;
  public saveBtnName: string;
  public closeBtnName: string;
  public availableRoles: string[] = [];
  public selectedRoles: string[] = [];
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UsersService,
    private roleService: RolesService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  ngOnInit(): void {
    this.loadDetail(this.config.data?.id);
    this.loadRoles();
    this.saveBtnName = 'Cập nhật';
    this.closeBtnName = 'Hủy';
  }

  loadRoles() {
    this.toggleBlockUI(true);
    this.roleService
      .getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: RoleDto[]) => {
        res.forEach(element => {
          this.availableRoles.push(element.name);
        });
        this.toggleBlockUI(false);
      });
  }

  loadDetail(id: string) {
    this.toggleBlockUI(true);
    this.userService
      .get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: UserDto) => {
          this.selectedRoles = res.roles;
          this.availableRoles = this.availableRoles.filter(
            item => !this.selectedRoles.includes(item)
          );
          this.toggleBlockUI(false);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  saveChange() {
    this.toggleBlockUI(true);
    this.userService
      .assignRoles(this.config.data.id, this.selectedRoles)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(true);
        },
        error: err => {
          this.toggleBlockUI(false);
        },
      });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.btnDisabled = true;
      this.blockedPanelDetail = true;
    } else {
      setTimeout(() => {
        this.btnDisabled = false;
        this.blockedPanelDetail = false;
      }, 1000);
    }
  }
}
