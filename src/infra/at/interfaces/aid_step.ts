export interface aid_step {
  '@id'?: string;
  name: string;
  slug?: string;
  position?: number;
  time_create?: Date;
  time_update?: Date;
  aids?: string[];
}
