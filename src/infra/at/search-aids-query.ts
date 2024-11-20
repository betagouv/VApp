export type AtSearchAidsQuery = {
  organization_type_slugs: string[];
  is_charged?: boolean;
  perimeter_id?: string;
  aid_type_group_slug?: string[];
  aid_step_slugs?: string[];
  aid_destination_slugs?: string[];
};
