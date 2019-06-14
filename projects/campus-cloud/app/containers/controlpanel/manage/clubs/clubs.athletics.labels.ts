export enum isClubAthletic {
  'club' = 0,
  'athletic' = 16
}

export function clubAthleticLabels(type) {
  let labels = {};

  if (type === isClubAthletic.club) {
    labels = {
      club_athletic: 'clubs',
      create_edit_banner: 'clubs_label_club_banner',
      create_edit_details: 'clubs_label_club_details',
      create_edit_name: 'clubs_label_club_name',
      create_edit_description: 'clubs_label_club_description',
      create_edit_status: 'clubs_label_club_status',
      create_edit_membership: 'clubs_label_club_membership',
      create_button: 'clubs_button_create',
      delete_modal_label: 'clubs_delete_modal_title',
      import_items: 'clubs_import_items_to_import',
      import_heading: 'clubs_import_heading',
      all: 'clubs_all_clubs',
      import_button: 'clubs_import_button_submit',
      edit_button: 'clubs_label_edit_club'
    };
  } else {
    labels = {
      club_athletic: 'athletics',
      create_edit_banner: 'athletics_label_athletic_banner',
      create_edit_details: 'athletics_label_athletic_details',
      create_edit_name: 'athletics_label_athletic_name',
      create_edit_description: 'athletics_label_athletic_description',
      create_edit_status: 'athletics_label_athletic_status',
      create_edit_membership: 'athletics_label_athletic_membership',
      create_button: 'athletics_button_create',
      delete_modal_label: 'athletics_delete_modal_title',
      import_items: 'athletics_import_items_to_import',
      import_heading: 'athletics_import_heading',
      all: 'athletics_all_athletics',
      import_button: 'athletics_import_button_submit',
      edit_button: 'athletics_label_edit_athletic'
    };
  }

  return labels;
}
