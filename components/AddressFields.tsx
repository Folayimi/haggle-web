"use client";

import type { AddressDraft } from "@/types/address";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCities,
  getCountries,
  getCountry,
  getStates,
} from "@/lib/address-options";

type Props = {
  value: AddressDraft;
  onChange: (value: AddressDraft) => void;
  errors?: Record<string, string>;
  title?: string;
  showStreet?: boolean;
};

const fieldClass =
  "w-full rounded-lg border border-border/70 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function AddressSelect({
  label,
  value,
  placeholder,
  options,
  disabled = false,
  error,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <Select items={options}>
        <SelectTrigger
          disabled={disabled}
          className={cn(
            "relative w-full rounded-xl border border-border/60 bg-background-elevated/40 px-4 py-6 text-left text-sm text-foreground shadow-sm transition-all focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30",
            error && "border-danger/50 focus:border-danger/50 focus:ring-danger/30",
          )}
        >
          <SelectValue placeholder={value || placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="bg-popover">
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="w-full px-4 py-2 text-left text-sm text-foreground transition hover:bg-primary/5 focus:bg-primary/5"
                onClick={() => onChange(option.value)}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}

export default function AddressFields({
  value,
  onChange,
  errors = {},
  title = "Address",
  showStreet = true,
}: Props) {
  const countries = getCountries();
  const country = getCountry(value.country_code);
  const states = country ? getStates(country.isoCode) : [];
  const selectedState = states.find((state) => state.name === value.state);
  const cities =
    country && selectedState
      ? getCities(country.isoCode, selectedState.isoCode)
      : [];
  const update = (field: keyof AddressDraft, nextValue: string) =>
    onChange({ ...value, [field]: nextValue });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold">{title}</h3>
      {showStreet && (
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Street address</span>
          <input
            value={value.line_1}
            onChange={(event) => update("line_1", event.target.value)}
            placeholder="1 Example Street"
            className={fieldClass}
          />
          {errors.line_1 && (
            <span className="text-xs text-danger">{errors.line_1}</span>
          )}
        </label>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <AddressSelect
          label="Country"
          value={value.country}
          placeholder="Select country"
          options={[
            ...(value.country_code && !country
              ? [{ value: value.country_code, label: value.country }]
              : []),
            ...countries.map((item) => ({
              value: item.isoCode,
              label: item.name,
            })),
          ]}
          error={errors.country}
          onChange={(countryCode) => {
            const next = getCountry(countryCode);
            onChange({
              ...value,
              country_code: countryCode,
              country: next?.name ?? value.country,
              state: "",
              city: "",
            });
          }}
        />
        <AddressSelect
          label="State / Region"
          value={value.state}
          placeholder={country ? "Select state or region" : "Select a country first"}
          options={[
            ...(value.state && !selectedState
              ? [{ value: value.state, label: value.state }]
              : []),
            ...states.map((state) => ({
              value: state.name,
              label: state.name,
            })),
          ]}
          disabled={!country}
          error={errors.state}
          onChange={(state) => onChange({ ...value, state, city: "" })}
        />
        <AddressSelect
          label="City"
          value={value.city}
          placeholder={value.state ? "Select city" : "Select a state first"}
          options={[
            ...(value.city && !cities.some((city) => city.name === value.city)
              ? [{ value: value.city, label: value.city }]
              : []),
            ...cities.map((city) => ({ value: city.name, label: city.name })),
          ]}
          disabled={!value.state || cities.length === 0}
          error={errors.city}
          onChange={(city) => update("city", city)}
        />
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Postal code</span>
          <input
            value={value.postal_code}
            onChange={(event) => update("postal_code", event.target.value)}
            placeholder="100001"
            className={fieldClass}
          />
          {errors.postal_code && (
            <span className="text-xs text-danger">{errors.postal_code}</span>
          )}
        </label>
      </div>
    </div>
  );
}
