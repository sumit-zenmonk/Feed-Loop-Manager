import { faker } from '@faker-js/faker';
import { dataSource, options } from './data-source';
import { UserEntity } from 'src/domain/entities/user/user.entity';
import { BcryptService } from '../services/bcrypt.service';
import { UserRoleEnum } from 'src/domain/enums/user';
import { FeedbackEntity } from 'src/domain/entities/feedback/feedback.entity';
import { FeedbackTagEntity } from 'src/domain/entities/feedback/feedback.tag.entity';

async function create() {
    dataSource.setOptions({
        ...options,
    });

    await dataSource.initialize();

    const bcryptService = new BcryptService();
    const hashedPassword = await bcryptService.hashPassword("123");

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const _ of Array.from(Array(15).keys())) {
            const user = await queryRunner.manager.save(UserEntity, {
                email: faker.internet.email(),
                password: hashedPassword,
                name: faker.person.fullName(),
                role: UserRoleEnum.ADMIN
            });
            console.log(user);

            const feedback = await queryRunner.manager.save(FeedbackEntity, {
                title: faker.book.title(),
                description: faker.book.genre(),
                creator_uuid: user.uuid
            });

            for (const _ of Array.from(Array(2).keys())) {
                await queryRunner.manager.save(FeedbackTagEntity, {
                    feedback_uuid: feedback.uuid,
                    tag_name: faker.word.sample(5) 
                });
            }
        }

        await queryRunner.commitTransaction();
        console.info('✅ Seeded successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('❌ Something went wrong:', error);
    } finally {
        await queryRunner.release();
    }
}

void create();