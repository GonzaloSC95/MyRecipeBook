import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  /**
   * Upload a file to the server
   * @param file The file to upload
   * @param type The type of file ('category' or 'recipe')
   * @returns An Observable of HttpEvent for tracking upload progress
   */
  upload(file: File, type: string): Observable<HttpEvent<any>> {
    // Validate type parameter
    if (type !== 'category' && type !== 'recipe') {
      throw new Error("Type must be either 'category' or 'recipe'");
    }

    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const req = new HttpRequest('POST', this.baseUrl, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  /**
   * Get the full URL for a file
   * @param fileName The name of the file
   * @param type The type of file ('category' or 'recipe')
   * @returns The full URL to access the file
   */
  getFileUrl(fileName: string, type: string): string {
    return `${environment.apiUrl}/api/files/${type}/${fileName}`;
  }

  /**
   * Extract file name from a file URL
   * @param url The full URL of the file
   * @returns The file name
   */
  getFileNameFromUrl(url: string): string {
    if (!url) return '';
    const segments = url.split('/');
    return segments[segments.length - 1];
  }
}