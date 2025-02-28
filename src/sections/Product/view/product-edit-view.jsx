import React from 'react';

// import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import ProductNewEditForm from '../product-new-edit-form';

export default function ProductEditView() {

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product', href: paths.dashboard.product.list },
          { name: 'Product Edit'},
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm  />
    </Container>
  );
}

// ProductEditView.propTypes = {
//   id: PropTypes.string,
// };
