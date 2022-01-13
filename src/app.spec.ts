import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { EnumRole } from './constants/enums';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';

const result = {
  user: {
    _id: 123 as any,
    role: EnumRole.SHIPPER,
    email: '',
    createdDate: new Date(Date.now()),
  },
};
describe('UserController', () => {
  let catsController: UserController;
  let catsService: UserService;

  beforeEach(() => {
    catsService = new UserService({} as Model<UserDocument>);
    catsController = new UserController(catsService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest
        .spyOn(catsService, 'getMe')
        .mockImplementation(() => Promise.resolve(result));

      expect(await catsController.get({ user: { id: 123 } })).toBe(result);
    });
  });
});
const sum = (a, b) => a + b;
describe('function', () => {
  it('sum', () => {
    expect(sum(1, 1)).toBe(2);
  });
});
