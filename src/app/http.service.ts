import { IQueryParams, IQueryResult } from './http.service';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app.settings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

export abstract class GenericHttpService {

    abstract get endpoint(): string;

    private _url = '';
    get url(): string {
        if (!this._url)
            this._url = AppSettings.getApiEndpoint(this.endpoint);
        return this._url;
    }

    protected handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg = HttpService.extractErrorMessage(error);
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    public static extractErrorMessage(error: Response | any): string {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = (body.messages && body.messages.length) ? body.messages[0].message : null;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return errMsg;
    }

}

export abstract class HttpService<T extends { id?: number }> extends GenericHttpService {

    constructor(protected http: Http) { super(); }

    get(queryParamas?: IQueryParams): Observable<IQueryResult<T> | T[]> {
        let params: URLSearchParams = new URLSearchParams();
        for (let key in queryParamas) {
            if (queryParamas.hasOwnProperty(key)) {
                let element = queryParamas[key];
                params.set(key, element);
            }
        }

        return this.http.get(this.url, { search: params })
            .map(res => <T[]>res.json())
            .do(data => console.log(data))
            .catch(this.handleError);
    }

}

export abstract class HttpSubService<T extends { id?: number }> extends GenericHttpService {

    private _innerUrl: string;
    innerUrl(ownerId: number): string {
        if (!this._innerUrl)
            this._innerUrl = AppSettings.getApiEndpoint(this.superEndpoint)
                + `/${ownerId}/${this.endpoint}/`;
        return this._innerUrl;
    }

    constructor(protected http: Http, protected superEndpoint: string) { super(); }

    get(ownerId: number): Observable<IQueryResult<T> | T[]> {
        return this.http.get(this.innerUrl(ownerId))
            .map(res => <T[]>res.json())
            .do(data => console.log(data))
            .catch(this.handleError);
    }

}

export interface IQueryParams {
    /** Indicates the start date */
    startdate?: string | Date;

    /** Indicates the end date */
    enddate?: string | Date;

    /** Indicates the state */
    state?: string;

    /** Indicates the page beginning */
    start?: number;

    /** Indicates the page size, if this param is null then its take as value 20. */
    size?: number;

    /** String to look for in the list, you can search by identification, name and last name. */
    search?: string;

    /** The return array of the function will be sorted by this attribute */
    orderBy?: string;

    /** Indicates if the list will be ordered to way ascendant (ASC) or descendant (DESC) */
    orderType?: 'ASC' | 'DESC';

    /** Specify if you need filtered result by the user type */
    type?: string;
}

export interface IQueryResult<T> {
    total: number;
    items: Array<T>;
}
