import React from 'react';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProfileNewEditForm from '../profile-new-edit-form';

export default function ProfileEditView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Profile', href: paths.dashboard.profile.root },
          { name: 'Product Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProfileNewEditForm profileId={id} />
    </Container>
  );
}

ProfileEditView.propTypes = {
  id: PropTypes.string,
};
