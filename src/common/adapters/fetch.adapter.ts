import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('This is an error');
      }
      return response.json();
    } catch (error) {
      throw new Error('This is an error');
    }
  }
}
