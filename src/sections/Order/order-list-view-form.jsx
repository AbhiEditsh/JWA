import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import OrderDetailsToolbar from './order-details-toolbar';
import { paths } from 'src/routes/paths';
import { ORDER_STATUS_OPTIONS } from 'src/_mock/_order';
import { useSettingsContext } from 'src/components/settings';
import { Grid, Stack, Container } from '@mui/material';
import OrderDetailsItems from './order-details-item';
import OrderDetailsInfo from './order-details-info';

export default function OrderNewEditForm({ orderId }) {
  const settings = useSettingsContext();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');

  // Fetch order details
  useEffect(() => {
    if (!orderId) return;

    axios
      .get(`${import.meta.env.VITE_AUTH_API}/api/admin/orders/${orderId}`)
      .then(({ data }) => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, [orderId]);

  // Handle status change
  const handleChangeStatus = (newStatus) => {
    setStatus(newStatus);

    // Send update request to backend
    axios
      .put(`${import.meta.env.VITE_AUTH_API}/api/admin/orders/status/${orderId}`, {
        status: newStatus,
      })
      .then(({ data }) => console.log('Status updated:', data))
      .catch((error) => console.error('Status update error:', error));
  };

  if (!order) return <p>Loading...</p>;

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <OrderDetailsToolbar
        orderNo={orderId}
        status={status}
        backLink={paths.dashboard.order.root}
        onChangeStatus={handleChangeStatus}
        statusOptions={ORDER_STATUS_OPTIONS}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <OrderDetailsItems
              items={order.items}
              subTotal={order.amount}
              totalAmount={order.amount}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md={4}>
          <OrderDetailsInfo
            customer={order.userId}
            delivery={order.billingAddress}
            payment={order.paymentMethod}
            shippingAddress={order.shippingAddress}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

OrderNewEditForm.propTypes = {
  orderId: PropTypes.string.isRequired,
};
