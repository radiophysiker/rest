import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Course } from 'src/course/course.entity';
import { Tag } from 'src/tag/tag.entity';

@Entity()
export class CourseTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course, (course) => course.courseTags)
  course: Course;

  @ManyToOne(() => Tag, (tag) => tag.courseTags)
  tag: Tag;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  taggedAt: Date;
}
