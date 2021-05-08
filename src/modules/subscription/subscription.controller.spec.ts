import { SubscriptionPrivateController } from './subscription.private.controller';
import { SubscriptionPublicController } from './subscription.public.controller';
import { SubscriptionService } from './subscription.service';

describe('Subscription', () => {
  let subscriptionPublicController: SubscriptionPublicController;
  let subscriptionPrivateController: SubscriptionPrivateController;
  let subscriptionService: SubscriptionService;

  beforeEach(() => {
    subscriptionService = new SubscriptionService(null);
    subscriptionPublicController = new SubscriptionPublicController(
      subscriptionService,
    );
    subscriptionPrivateController = new SubscriptionPrivateController(
      subscriptionService,
    );
  });
  const request = {
    headers: {
      'x-api-key': 123456,
    },
  };
  describe('SubscriptionPublicController', () => {
    it('createSubscription ', async () => {
      const createSubscriptionMock = jest
        .spyOn(subscriptionService, 'createSubscription')
        .mockImplementation(() => Promise.resolve());
      const payload = {
        email: 'l@l.com',
        dateOfBirth: '2020-01-01',
        consent: true,
        campaignId: '123456',
        firstName: 'Peter',
        gender: 'O',
      };
      await subscriptionPublicController.createSubscription(payload);
      expect(createSubscriptionMock).toHaveBeenCalledWith(payload);
      expect(createSubscriptionMock).toHaveReturned();
    });

    it('revokeSubscription ', async () => {
      const revokeSubscription = jest
        .spyOn(subscriptionService, 'revokeSubscription')
        .mockImplementation(() => Promise.resolve());

      await subscriptionPublicController.revokeSubscription('foo');
      expect(revokeSubscription).toHaveBeenCalledWith('foo');
      expect(revokeSubscription).toHaveReturned();
    });
  });

  describe('SubscriptionPrivateController', () => {
    it('getAll ', async () => {
      const expectedResult = {
        items: [
          {
            id: '5dab887b-a295-4d26-9daa-a3b9b22f9e25',
            email: 'l@ll.com',
            firstName: 'pepe',
            gender: 'Male',
            dateOfBirth: '2020-12-12T12:00:00.000Z',
            consent: true,
            isActive: false,
            campaignId: '123456',
          },
        ],
        count: 4,
      };
      const getAllSubscriptionMock = jest
        .spyOn(subscriptionService, 'getAll')
        .mockImplementation(() => expectedResult as any);

      const result = await subscriptionPrivateController.getAll(1, 0, request);
      expect(result).toBe(expectedResult);
      expect(getAllSubscriptionMock).toHaveReturned();
    });

    it('getById ', async () => {
      const expectedResult = {
        id: '5dab887b-a295-4d26-9daa-a3b9b22f9e25',
        email: 'l@ll.com',
        firstName: 'pepe',
        gender: 'Male',
        dateOfBirth: '2020-12-12T12:00:00.000Z',
        consent: true,
        isActive: false,
        campaignId: '123456',
      };
      const getByIdSubscriptionMock = jest
        .spyOn(subscriptionService, 'getById')
        .mockImplementation(() => expectedResult as any);

      const result = await subscriptionPrivateController.getById(
        '5dab887b-a295-4d26-9daa-a3b9b22f9e25',
        request,
      );
      expect(result).toBe(expectedResult);
      expect(getByIdSubscriptionMock).toHaveReturned();
    });

    it('sendNewsLetter ', async () => {
      const expectedResult = {
        status: '200',
        id: '123456',
      };
      const sendNewsLetterSubscriptionMock = jest
        .spyOn(subscriptionService, 'sendNewsLetter')
        .mockImplementation(() => Promise.resolve(expectedResult));

      const result = await subscriptionPrivateController.sendNewsLetter(
        '123456',
        request,
      );
      expect(result).toBe(expectedResult);
      expect(sendNewsLetterSubscriptionMock).toHaveReturned();
    });
  });
});
