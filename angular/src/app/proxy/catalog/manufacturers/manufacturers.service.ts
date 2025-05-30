import type { CreateUpdateManufactureDto, ManufacturerDto, ManufacturerInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ManufacturersService {
  apiName = 'Default';
  

  create = (input: CreateUpdateManufactureDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ManufacturerDto>({
      method: 'POST',
      url: '/api/app/manufacturers',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/manufacturers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultipleByIds = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/manufacturers/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ManufacturerDto>({
      method: 'GET',
      url: `/api/app/manufacturers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ManufacturerDto>>({
      method: 'GET',
      url: '/api/app/manufacturers',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ManufacturerInListDto[]>({
      method: 'GET',
      url: '/api/app/manufacturers/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ManufacturerInListDto>>({
      method: 'GET',
      url: '/api/app/manufacturers/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getSuggestNewCode = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/manufacturers/suggest-new-code',
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateManufactureDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ManufacturerDto>({
      method: 'PUT',
      url: `/api/app/manufacturers/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
