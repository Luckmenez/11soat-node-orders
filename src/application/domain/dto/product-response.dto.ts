interface ProductEntity {
  name: string;
  description?: string | null;
  price: number;
  available: boolean;
  url_img?: string | null;
}

interface Category {
  id: number | null;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  amount: number;
  url_img: string;
  customizable: boolean;
  available: boolean;
  category_id: number | null;
  category?: Category;
  productItems?: ProductEntity[];
}

export type ProductResponseDto = Product;
