import { Injectable } from '@angular/core';
import { GenericCrudService } from './generic-crud.service';
import { environment } from '../../environments/environment';
import {
  GeneratorRequest,
  IAGeneratorResponse,
} from '../interfaces/iaGenerator.interface';

@Injectable({
  providedIn: 'root',
})
export class IAGeneratorImageService extends GenericCrudService<
  IAGeneratorResponse,
  GeneratorRequest
> {
  constructor() {
    super(environment.urlIaGeneratorApi);
  }
}
