import {
  Column,
  DataType,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'user/user.model';

interface ActivationCreationAttrs {
  userId: number;
  code: string;
  status: string;
}

@Table({ tableName: 'activation' })
export class Activation extends Model<Activation, ActivationCreationAttrs> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  code: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false })
  status: boolean;

  @HasOne(() => User)
  owner: User;
}
