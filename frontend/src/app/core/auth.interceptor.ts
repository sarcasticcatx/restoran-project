import { HttpInterceptorFn } from '@angular/common/http';

  export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // avtomatski da se isprakjaat cookies so sekoe baranje
    // go dodadov ova posho samo dve linii se.
    const authReq = req.clone({
      withCredentials: true
    });

    return next(authReq);
  };

