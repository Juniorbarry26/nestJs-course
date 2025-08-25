import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { HashingService } from '../../../auth/hashing/hashing.service';
import { User } from '../entities/user.entity';

@Injectable()
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly hashingService: HashingService,
  ) {
    // ✅ register this subscriber with TypeORM
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const { entity: user } = event;
    if (user.password) {
      user.password = await this.hashingService.hash(user.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const { entity, databaseEntity } = event;
    const user = entity as User;
    if (user?.password && user.password !== databaseEntity?.password) {
      user.password = await this.hashingService.hash(user.password);
    }
  }
}
