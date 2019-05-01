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
  static DEFAULT_SERVICE_URL =
    'http://localhost:8080/podtracker-services-java/';
  //static DEFAULT_SERVICE_URL = 'https://pod-tracker.herokuapp.com/';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  public requestPipe = function(notify = true) {
    if (notify) {
      this.snackBar.openFromComponent(ToastComponent, {
        duration: false,
        data: { type: 'loading' }
      });
    }

    return pipe(
      map((res: any) => {
        if (notify) {
          this.snackBar.openFromComponent(ToastComponent, {
            duration: 3000,
            data: { type: 'success' }
          });
        }
        return res;
      }),
      catchError(err => {
        this.snackBar.openFromComponent(ToastComponent, {
          duration: 5000,
          data: { type: 'error', message: err.error.message }
        });

        return throwError(err);
      })
    );
  };

  get({
    control,
    params,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestParams): Observable<any> {
    return this.http.get(
      `${urlPrefix}webresources/${control}`,
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
      `${urlPrefix}webresources/${control}/${action}`,
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
    return this.http
      .post(
        `${urlPrefix}webresources/${control}`,
        data,
        params ? { params: params } : undefined
      )
      .pipe(this.requestPipe(notify));
  }

  postAction({
    control,
    action,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestActionParams): Observable<any> {
    return this.http
      .post(
        `${urlPrefix}webresources/${control}/${action}`,
        data,
        params ? { params: params } : undefined
      )
      .pipe(this.requestPipe(notify));
  }

  put({
    control,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestParams): Observable<any> {
    return this.http
      .put(
        `${urlPrefix}webresources/${control}`,
        data,
        params ? { params: params } : undefined
      )
      .pipe(this.requestPipe(notify));
  }

  putAction({
    control,
    action,
    data,
    params,
    notify = true,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL
  }: RequestActionParams): Observable<any> {
    return this.http
      .put(
        `${urlPrefix}webresources/${control}/${action}`,
        data,
        params ? { params: params } : undefined
      )
      .pipe(this.requestPipe(notify));
  }

  delete({
    control,
    params,
    urlPrefix = AjaxCommService.DEFAULT_SERVICE_URL,
    notify = true
  }): Observable<any> {
    return this.http
      .delete(
        `${urlPrefix}webresources/${control}`,
        params ? { params: params } : undefined
      )
      .pipe(this.requestPipe(notify));
  }
}
