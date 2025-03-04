import React from 'react';

// import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CategoryNewEditForm from '../category-new-edit-form';

export default function CategoryEditView() {
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Category', href: paths.dashboard.category.list },
          { name: 'Category Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CategoryNewEditForm />
    </Container>
  );
}

// ProductEditView.propTypes = {
//   id: PropTypes.string,
// };
