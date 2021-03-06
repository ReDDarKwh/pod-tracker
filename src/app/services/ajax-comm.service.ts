import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { ToastComponent } from '../components/shared/toast/toast.component';

import { environment } from '../../environments/environment';

import { MatSnackBar } from '@angular/material';

import { throwError, pipe, Observable } from 'rxjs';

export class RequestParams {
  control: string;
  params?: HttpParams | { [param: string]: string | string[] };
  urlPrefix?: string;
  notify?: boolean;
  data?: any;
}

export class RequestActionParams extends RequestParams {
  action: string;
}

@Injectable({ providedIn: 'root' })
export class AjaxCommService {
  static DEFAULT_SERVICE_URL = 'https://pod-tracker.herokuapp.com/';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  get({
    control,
    params,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestParams): Observable<any> {
    return this.http.get(
      `${urlPrefix}api/${control}`,
      params ? { params: params } : undefined
    );
  }

  getAction({
    control,
    action,
    params,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestActionParams): Observable<any> {
    return this.http.get(
      `${urlPrefix}api/${control}/${action}`,
      params ? { params: params } : undefined
    );
  }

  post({
    control,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestParams): Observable<any> {
    return this.http.post(
      `${urlPrefix}api/${control}`,
      data,
      params ? { params: params } : undefined
    );
  }

  postAction({
    control,
    action,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestActionParams): Observable<any> {
    return this.http.post(
      `${urlPrefix}api/${control}/${action}`,
      data,
      params ? { params: params } : undefined
    );
  }

  put({
    control,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestParams): Observable<any> {
    return this.http.put(
      `${urlPrefix}api/${control}`,
      data,
      params ? { params: params } : undefined
    );
  }

  putAction({
    control,
    action,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestActionParams): Observable<any> {
    return this.http.put(
      `${urlPrefix}api/${control}/${action}`,
      data,
      params ? { params: params } : undefined
    );
  }

  delete({
    control,
    params,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL,
    notify = true
  }): Observable<any> {
    return this.http.delete(
      `${urlPrefix}api/${control}`,
      params ? { params: params } : undefined
    );
  }
}
