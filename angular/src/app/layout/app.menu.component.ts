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
        label: 'Sản phẩm',
        items: [
          {
            label: 'Danh sách sản phẩm',
            icon: 'pi pi-fw pi-circle',
            routerLink: ['/product'],
          },
          { label: 'Danh sách thuộc tính', icon: 'pi pi-fw pi-circle', routerLink: ['/attribute'] },
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
    ];
  }
}
