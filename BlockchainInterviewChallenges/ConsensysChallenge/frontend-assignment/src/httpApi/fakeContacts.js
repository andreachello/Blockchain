import faker from 'faker';

export const generateRandomContacts = ({ amount }) =>
  Array(amount).fill({}).map(() => (
    {
      id: faker.random.uuid(),
      name: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      addressLines: [
        faker.address.streetAddress(),
        faker.address.city(),
        faker.address.country(),
      ],
    }
  ));