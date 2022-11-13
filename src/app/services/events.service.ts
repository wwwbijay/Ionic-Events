import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(baseUrl + '/api/events/get-available-event-list');
  }

  getAllEventTypes(): Observable<any> {
    return this.http.get(baseUrl + '/api/events/get-event-type-list');
  }

  getById(id: any, edate: any): Observable<any> {
    return this.http.get(
      baseUrl +
        `/api/events/get-available-event-detail-byid?eventid=${id}&eventDate=${edate}`
    );
  }

  getNoOfTickets() {
    return this.http.get(
      baseUrl + '/api/ddl/get-no-of-tickets-to-buy-client-ddl'
    );
  }

  getAllEventTicketCategory(eventId :any, eventDate:any ) {
    return this.http.get(
      baseUrl + `/api/ddl/get-event-ticket-category-client-ddl?eventId=${eventId}&eventDate=${eventDate}`
    );
  }

  
}
