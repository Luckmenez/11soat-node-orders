import { ClientsCreateInterface } from 'src/application/domain/dto/client.db.interface';

export class ClientEntity {
  constructor(
    public readonly id: number | null,
    public readonly name: string,
    public readonly email: string,
    public readonly document: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: ClientsCreateInterface): ClientEntity {
    return new ClientEntity(null, props.name, props.email, props.document);
  }
}
