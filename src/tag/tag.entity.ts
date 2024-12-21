import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CourseTag } from 'src/course-tag/course-tag.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;

  @OneToMany(() => CourseTag, (courseTag) => courseTag.tag)
  courseTags: CourseTag[];
}
