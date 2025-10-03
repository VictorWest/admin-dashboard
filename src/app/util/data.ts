export const usStateAndTerritoryInitials = [
  // States
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",

  // District of Columbia
  "DC",

  // Territories
  "AS", // American Samoa
  "GU", // Guam
  "MP", // Northern Mariana Islands
  "PR", // Puerto Rico
  "VI"  // U.S. Virgin Islands
] as const;

export type USStateAndTerritoryType = typeof usStateAndTerritoryInitials[number]

export const canadianProvincesAndTerritories = [
  "AB", // Alberta
  "BC", // British Columbia
  "MB", // Manitoba
  "NB", // New Brunswick
  "NL", // Newfoundland and Labrador
  "NS", // Nova Scotia
  "NT", // Northwest Territories
  "NU", // Nunavut
  "ON", // Ontario
  "PE", // Prince Edward Island
  "QC", // Quebec
  "SK", // Saskatchewan
  "YT"  // Yukon
];
export type CanadianStateAndTerritoryType = typeof canadianProvincesAndTerritories[number]

export const countryOptions = ["USA", "CAN"]
export type CountryType = typeof countryOptions[number]

export const paymentCycleOptions = ["Daily", "Weekly", "Every other week", "Monthly", "Bimonthly"] as const
export type PaymentCycle = typeof paymentCycleOptions[number]

export const accountTypeOptions = ["Savings", "Checking"] as const
export type AccountType = typeof accountTypeOptions[number]