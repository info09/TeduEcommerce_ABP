import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Trang chủ',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }],
      },
      {
        label: 'Danh mục',
        items: [
          {
            label: 'Danh sách loại sản phẩm',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['/catalog/product-category'],
          },
          {
            label: 'Danh sách nhà sản xuất',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['/catalog/manufacturer'],
          },
        ],
      },
      {
        label: 'Sản phẩm',
        items: [
          {
            label: 'Danh sách sản phẩm',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['/catalog/product'],
          },
          {
            label: 'Danh sách thuộc tính',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['/catalog/attribute'],
          },
        ],
      },
      {
        label: 'Đơn hàng',
        items: [
          { label: 'Danh sách đơn hàng', icon: 'pi pi-fw pi-circle', routerLink: ['/order'] },
          { label: 'Danh sách vận chuyển', icon: 'pi pi-fw pi-circle', routerLink: ['/shipping'] },
        ],
      },
      {
        label: 'Khách hàng',
        items: [
          { label: 'Danh sách khách hàng', icon: 'pi pi-fw pi-circle', routerLink: ['/customer'] },
        ],
      },
      {
        label: 'Báo cáo',
        items: [
          { label: 'Báo cáo doanh thu', icon: 'pi pi-fw pi-circle', routerLink: ['/report'] },
        ],
      },
      {
        label: 'Hệ thống',
        items: [{ label: 'Quyền', icon: 'pi pi-fw pi-circle', routerLink: ['/system/role'] }],
      },
    ];
  }
}
