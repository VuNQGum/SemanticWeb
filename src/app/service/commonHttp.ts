import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MODEL } from '../model/dataModel';

@Injectable({
    providedIn: 'root',
})
export class CommonApiService {

    constructor(private http: HttpClient) { }

    onGetQuery= (query: string, url: string, showError: boolean = false): Observable<any> => {
      return this.http.get<MODEL>(url,
        { params: new HttpParams().set('query', query), })
        .pipe(
          catchError((eror) => {
            if (eror.status === 403) {
                eror.message = 'Dịch vụ không tồn tại hoặc bạn không có quyền truy cập dịch vụ này!';
            }
            if (showError) {
                // this.messageService.showErrorMessage('Thông báo: ', eror.message);
                console.log(eror.message);

            }
            return of({
                state: false,
                data: null,
                message: eror.message
            });
        }),
        switchMap((response: any) => {
            const rpstate = 'state' in response ? response.state : response.State;
            const rpmessage = 'message' in response ? response.message : response.Message;
            // const rpdata = 'data' in response ? response.data : response.Data;
            const rpdata = response.results.bindings;
            if (showError && !rpstate) {
                // this.messageService.showErrorMessage('Thông báo: ', rpmessage);
                console.log(rpmessage);
            }
            return of({
                state: rpstate,
                data: rpdata,
                message: rpmessage
            });
        }))
    }

    onPostQuery= (query: string, url: string, showError: boolean = false): Observable<any> => {
      return this.http.post<MODEL>(url, query, {headers: new HttpHeaders().set("Content-Type", "application/sparql-update")})
        .pipe(
          catchError((eror) => {
            if (eror.status === 403) {
                eror.message = 'Dịch vụ không tồn tại hoặc bạn không có quyền truy cập dịch vụ này!';
            }
            if (showError) {
                // this.messageService.showErrorMessage('Thông báo: ', eror.message);
                console.log(eror.message);

            }
            return of({
                state: false,
                data: null,
                message: eror.message
            });
        }),
        switchMap((response: any) => {
            // const rpstate = 'state' in response ? response.state : response.State;
            // const rpmessage = 'message' in response ? response.message : response.Message;
            // // const rpdata = 'data' in response ? response.data : response.Data;
            // const rpdata = response.results.bindings;
            // if (showError && !rpstate) {
            //     // this.messageService.showErrorMessage('Thông báo: ', rpmessage);
            //     console.log(rpmessage);
            // }
            return of({
                state: true,
                data: null,
                message: null
            });
        }))
    }

    onDescribe= (query: string, url: string, showError: boolean = false): Observable<any> => {
      const headers = new HttpHeaders().set('response-type', 'text').set('accept', 'text/rdf+n3;application/n3;text/n3');
      return this.http.get(url,
        { params: new HttpParams().set('query', query), headers: headers, observe: 'response'})
        .pipe(
            catchError((error) => {
                return of({
                    state: false,
                    data: error,
                    message: error.message
                });
            }),

        );
    }
}
