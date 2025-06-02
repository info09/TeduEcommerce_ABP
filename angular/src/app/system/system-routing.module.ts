import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'role',
    component: RoleComponent,
    data: {
      requiredPolicy: 'AbpIdentity.Roles',
    },
  },
  { path: 'user', component: UserComponent, data: { requiredPolicy: 'AbpIdentity.Users' } },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
