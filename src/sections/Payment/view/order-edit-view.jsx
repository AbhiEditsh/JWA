import React from 'react';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PaymentNewEditForm from '../payment-list-view-form';

export default function PaymentEditView({ id }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Payment', href: paths.dashboard.payment.list },
          { name: 'Payment Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PaymentNewEditForm orderId={id} />
    </Container>
  );
}

PaymentEditView.propTypes = {
  id: PropTypes.string,
};
