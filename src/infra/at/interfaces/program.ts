export interface program {
  '@id'?: string;
  name: string;
  slug?: string;
  description?: string;
  short_description?: string;
  logo?: string;
  logo_file?: string;
  delete_logo?: boolean;
  time_create?: Date;
  meta_description?: string;
  meta_title?: string;
  perimeter?: string;
  is_spotlighted?: boolean;
  aids?: string[];
  blog_promotion_posts?: any;
  faq_question_answsers?: any;
  page_tabs?: any;
  log_aid_searches?: any;
  log_program_views?: any;
  nb_aids?: number;
  time_update?: Date;
}
