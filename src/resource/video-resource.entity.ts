import { ChildEntity, Column } from 'typeorm';
import { Resource } from './resource.entity';

@ChildEntity()
export class VideoResource extends Resource {
  @Column()
  videoDuration: number;
}
