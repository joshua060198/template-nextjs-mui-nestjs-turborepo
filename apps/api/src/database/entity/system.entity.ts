import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("system_config")
export class SystemConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;
}
