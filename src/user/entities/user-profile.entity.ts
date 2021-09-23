import { User } from './user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Max, MaxLength, Min, MinLength } from 'class-validator';

export enum Gender {
  female = 'female',
  male = 'male',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  @Min(1)
  @Max(20)
  username: string;

  @Column({ name: 'phone_number', length: 255 })
  phoneNumber: string;

  @Column({ length: 255 })
  university: string;

  @Column({ name: 'is_graduate' })
  isGraduate: boolean;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Column({ length: 255 })
  @MaxLength(8)
  job: string;

  @Column({ name: 'short_bio', length: 255 })
  @MinLength(1)
  shortBio: string;

  @Column({ length: 255, nullable: true })
  location?: string;

  @Column({ type: 'json', nullable: true })
  interests?: string[];

  @Column({
    name: 'profile_image_url',
    length: 512,
    nullable: true,
    type: 'varchar',
  })
  profileImageUrl?: string;

  @Column()
  isMarketingAgree: boolean;

  @OneToOne((type) => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_user_id' })
  user: User;

  @Column('uuid')
  fk_user_id: string;
}
