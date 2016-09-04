import { Injectable }     from '@angular/core';
import { Http ,Response} from '@angular/http';
import { Observable }     from 'rxjs/Observable';
@Injectable()
export class getData {

  constructor (private _http: Http) {}

  
  private extractData(res: Response) {
    let body = res.json();
        console.log(body);
        return body || { };
  }
  private handleError (error: any) {
   
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
  public fetchData (url: string)  {
    return this._http.get(url)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
}