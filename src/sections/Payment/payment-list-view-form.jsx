import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useSettingsContext } from 'src/components/settings';
import { PAYMENT_STATUS_OPTIONS } from 'src/_mock/_order';
import { Grid, Stack, Container } from '@mui/material';
import PaymentDetailsItems from './payment-details-item';
import PaymentDetailsInfo from './payment-details-info';
import PaymentDetailsToolbar from './payment-details-toolbar';
import { paths } from 'src/routes/paths';

export default function PaymentNewEditForm({ orderId }) {
  const settings = useSettingsContext();
  const [order, setOrder] = useState(null);
  const [PaymentStatus, setPaymentStatus] = useState('');

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${import.meta.env.VITE_AUTH_API}/api/admin/orders/${orderId}`)
      .then(({ data }) => {
        setOrder(data);
        setPaymentStatus(data.paymentStatus);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [orderId]);

  // Handle status change
  const handleChangeStatus = (newStatus) => {
    setPaymentStatus(newStatus);

    axios
      .post(`${import.meta.env.VITE_AUTH_API}/api/payment/cod-payment-update`, {
        orderId,
      })
      .then(({ data }) => console.log('Status updated:', data))
      .catch((error) => console.error('Status update error:', error));
  };

  if (!order) return <p>Loading...</p>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <PaymentDetailsToolbar orderNo={orderId} backLink={paths.dashboard.payment.root} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <PaymentDetailsItems
              items={order.items}
              status={PaymentStatus}
              subTotal={order.amount}
              totalAmount={order.amount}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <PaymentDetailsInfo
            customer={order.userId}
            delivery={order.billingAddress}
            payment={order.paymentMethod}
            shippingAddress={order.shippingAddress}
            onChangeStatus={handleChangeStatus}
            paymentStatus={PaymentStatus}
            statusOptions={PAYMENT_STATUS_OPTIONS}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

PaymentNewEditForm.propTypes = {
  orderId: PropTypes.string.isRequired,
};
