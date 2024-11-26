export interface project_reference {
  '@id'?: string;
  name: string;
  slug?: string;
  project_reference_category?: string;
  projects?: any;
  aids?: string[];
  excluded_keyword_references?: any;
  nb_search_result?: number;
  required_keyword_references?: any;
  readonly aids_live?: string[];
}
