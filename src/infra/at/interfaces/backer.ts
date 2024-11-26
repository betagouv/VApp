export interface backer {
  '@id'?: string;
  name?: string;
  slug?: string;
  is_corporate?: boolean;
  external_link?: string;
  is_spotlighted?: boolean;
  logo?: string;
  logo_file?: string;
  delete_logo?: boolean;
  description?: string;
  time_create?: Date;
  meta_description?: string;
  meta_title?: string;
  perimeter?: string;
  organizations?: any;
  data_sources?: any;
  aid_financers?: any;
  aid_instructors?: any;
  project_validateds?: any;
  blog_promotion_posts?: any;
  backer_group?: string;
  time_update?: Date;
  log_aid_searches?: any;
  log_backer_views?: any;
  active?: boolean;
  backer_type?: string;
  projects_examples?: string;
  internal_operation?: string;
  contact?: string;
  useful_links?: string;
  categories?: string[];
  programs?: string[];
  aids_thematics?: string[];
  nb_aids_by_type_group_slug?: number;
  nb_aids_by_type_slug?: number;
  last_log_backer_edit?: any;
  aids_live?: string[];
  aids_financial?: string[];
  aids_technical?: string[];
  nb_aids?: number;
  nb_aids_live?: number;
  nb_aids_live_financial?: number;
  nb_aids_live_technical?: number;
  backer_locks?: any;
  backer_ask_associates?: any;
  log_backer_edits?: any;
  readonly aids_by_aid_type_slug?: string[];
}
