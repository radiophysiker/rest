import { ChildEntity, Column } from 'typeorm';
import { Resource } from './resource.entity';

@ChildEntity()
export class FileResource extends Resource {
  @Column()
  fileType: string;
}
