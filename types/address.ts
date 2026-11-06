export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone_e164: string;
  country: string;
  country_code: string;
  state: string;
  city: string;
  line_1: string;
  line_2?: string | null;
  postal_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressDraft = Pick<
  UserAddress,
  "country" | "country_code" | "state" | "city" | "line_1" | "postal_code"
>;

export type CreateAddressInput = Pick<
  UserAddress,
  | "label"
  | "recipient_name"
  | "phone_e164"
  | "country"
  | "country_code"
  | "state"
  | "city"
  | "line_1"
  | "postal_code"
> & {
  line_2?: string | null;
  is_default?: boolean;
};

export type UpdateAddressInput = Partial<CreateAddressInput>;
