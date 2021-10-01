import { Place } from './place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from 'src/review/entities/review.entity';

@Entity()
export class PlaceDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  description!: string;

  @Column({ type: 'json' })
  categories: string[];

  @OneToMany((type) => Review, (review) => review.place)
  reviews: Review[];

  @Column({ type: 'json' })
  photos: string[];

  @Column({ length: 255 })
  detailAddress: string;

  @Column({ length: 255, default: '' })
  detailLink: string;

  @Column({ default: 0 })
  participationFee: number;

  @OneToOne((type) => Place, (place) => place.placeDetail, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @Column({ type: 'uuid' })
  place_id: string;

  @Column('timestamptz', { select: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column('timestamptz', { select: false })
  @UpdateDateColumn()
  updatedAt: Date;
}
