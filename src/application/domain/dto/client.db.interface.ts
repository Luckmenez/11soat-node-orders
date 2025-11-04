export interface ClientsCreateInterface {
  name: string;
  email: string;
  document: string;
}

export interface IdentifyClientInterface {
  document: string;
  email?: string;
}

export interface ClientResponseDto {
  id: number | null;
  name: string;
  email: string;
  document: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientPersistenceDto {
  id?: number;
  name: string;
  email: string;
  document: string;
  phone?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
