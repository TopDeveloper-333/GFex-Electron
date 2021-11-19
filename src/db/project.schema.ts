import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Project 
{
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  project_name!: string ;

  @Column({default: ''})
  content !: string ;

  @Column({default: ''})
  result !: string ;

}