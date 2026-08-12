

import { Injectable } from '@angular/core';
import { mapAttachmentToPhoto } from '../../data/mappers/attachment.mapper';
import { AttachmentRepository } from '../../data/repositories/attachment.repository';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root'
})
export class CreateReport {
  constructor(private readonly repository: AttachmentRepository) {}

  async execute(report: string, photos: []){
    //Terminar el caso de uso
  }
}
