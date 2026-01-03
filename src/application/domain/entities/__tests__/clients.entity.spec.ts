import { ClientEntity } from '../clients.entitity';

describe('ClientEntity', () => {
  describe('create', () => {
    it('should create a client entity with all required fields', () => {
      const clientData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        document: '12345678900',
      };

      const client = ClientEntity.create(clientData);

      expect(client).toBeInstanceOf(ClientEntity);
      expect(client.id).toBeNull();
      expect(client.name).toBe('John Doe');
      expect(client.email).toBe('john.doe@example.com');
      expect(client.document).toBe('12345678900');
    });

    it('should set id as null for new entities', () => {
      const clientData = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        document: '98765432100',
      };

      const client = ClientEntity.create(clientData);

      expect(client.id).toBeNull();
    });

    it('should not include createdAt and updatedAt on creation', () => {
      const clientData = {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        document: '11122233344',
      };

      const client = ClientEntity.create(clientData);

      expect(client.createdAt).toBeUndefined();
      expect(client.updatedAt).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should create client with constructor directly', () => {
      const client = new ClientEntity(
        1,
        'Alice Brown',
        'alice@example.com',
        '55566677788',
      );

      expect(client.id).toBe(1);
      expect(client.name).toBe('Alice Brown');
      expect(client.email).toBe('alice@example.com');
      expect(client.document).toBe('55566677788');
    });

    it('should accept optional createdAt and updatedAt', () => {
      const now = new Date();
      const client = new ClientEntity(
        1,
        'Charlie Wilson',
        'charlie@example.com',
        '99988877766',
        now,
        now,
      );

      expect(client.createdAt).toBe(now);
      expect(client.updatedAt).toBe(now);
    });

    it('should allow null id for new entities', () => {
      const client = new ClientEntity(
        null,
        'Diana Prince',
        'diana@example.com',
        '12312312312',
      );

      expect(client.id).toBeNull();
    });
  });
});
