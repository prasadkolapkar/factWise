export class ICelebrityDetails {
  id?: number;
  first?: string;
  last?: string;
  dob?: string;
  gender?: string;
  email?: string;
  picture?: string;
  country?: string;
  description?: string
}

export enum Gender {
  Male = "male",
  Female = "female",
  Transgender = "transgender"
}


export const GenderDisplayNameMap = {
  [Gender.Male]: "Male",
  [Gender.Female]: "Female",
  [Gender.Transgender]: "Transgender"
}


export const OnlyAplabets = /^[a-zA-Z ]*$/;
