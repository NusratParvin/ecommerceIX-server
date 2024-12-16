export type ShippingInfoProps = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  name: string;
};

export interface CartItems {
  productId: string;
  quantity: number;
  price: number;
}
