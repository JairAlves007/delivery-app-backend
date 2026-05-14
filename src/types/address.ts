export type UserAddressWithDefault = {
  id: string;
  address_id: string;
  is_default: boolean;
  street: string;
  number: string | null;
  neighborhood: string;
  city: string;
  state: string;
  postal_code: string;
  complement: string | null;
  reference_point: string | null;
  phone: string;
  latitude: number | null;
  longitude: number | null;
};
