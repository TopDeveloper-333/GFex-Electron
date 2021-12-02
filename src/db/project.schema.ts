import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Project 
{
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  project_name!: string ;

  @Column({default: ''})
  content!: string ;

  @Column({default: ''})
  result!: string ;

}

@Entity()
export class Plot 
{
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  plot_name!: string ;

  @Column({default: ''})
  plot!: string ;

  @Column({default: ''})
  project!: string ;

  @Column({type: 'date', default: '0000-00-00'})
  created!: string ;
}