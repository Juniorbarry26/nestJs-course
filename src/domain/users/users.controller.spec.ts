import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => ({
      id,
      ...dto,
    })),
    findOne: jest.fn((id) => ({
      id,
    })),
    findAll: jest.fn((paginationDto) => [
      {
        id: 1,
        name: 'Alsainey',
      },
      {
        id: 2,
        name: 'Ebrima',
      },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create multiple users', () => {
    const users = [
      {
        name: 'Alsainey',
        email: 'alsainey@example.com',
        phone: '1234567890',
        password: 'StrongP@ss1',
      },
      {
        name: 'Ebrima',
        email: 'ebrima@example.com',
        phone: '1234567890',
        password: 'StrongP@ss1',
      },
      {
        name: 'Mariama',
        email: 'mariama@example.com',
        phone: '1234567890',
        password: 'StrongP@ss1',
      },
      {
        name: 'Binta',
        email: 'binta@example.com',
        phone: '1234567890',
        password: 'StrongP@ss1',
      },
    ];

    for (const dto of users) {
      const result = controller.create(dto);

      expect(result).toEqual({
        id: expect.any(Number),
        ...dto,
      });

      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    }

    // Optional: check that the mock was called the correct number of times
    expect(mockUsersService.create).toHaveBeenCalledTimes(users.length);
  });

  it('should update a user', () => {
    const dto = {
      ame: 'Ebrima',
      email: 'alsainey@example.com',
      phone: '1234567890',
      password: 'StrongP@ss1',
    };

    expect(controller.update({ id: 1 }, dto)).toEqual({
      id: 1,
      ...dto,
    });

    expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
  });

  it('should find a specific user', () => {
    const idDto = { id: 1 };

    const result = controller.findOne(idDto);

    expect(result).toEqual({ id: 1 });
    expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
  });

  it('should find all users', () => {
    const paginationDto = { limit: 10, page: 1 };

    const result = controller.findAll(paginationDto);

    expect(result).toEqual([
      {
        id: 1,
        name: 'Alsainey',
      },
      {
        id: 2,
        name: 'Ebrima',
      },
    ]);

    expect(mockUsersService.findAll).toHaveBeenCalledWith(paginationDto);
  });

  it('should delete a user', () => {});
});
