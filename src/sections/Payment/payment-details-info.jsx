import PropTypes from 'prop-types';
import { Box, Card, Stack, Avatar, Divider, Typography, MenuItem, Button, Grid } from '@mui/material';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function PaymentDetailsInfo({
  customer,
  delivery,
  payment,
  shippingAddress,
  paymentStatus,
  statusOptions,
  onChangeStatus,
}) {
  const popover = usePopover();

  return (
    <Card>
        
      <Stack direction="row" sx={{ p: 3 }}>
        <Avatar
          alt={customer.name}
          src={customer.profilePicture}
          sx={{ width: 48, height: 48, mr: 2 }}
        />
        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
          <Typography variant="subtitle2">{customer.username}</Typography>
          <Box sx={{ color: 'text.secondary' }}>{customer.email}</Box>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* Delivery Details */}
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address:
          </Box>
          {`${delivery.address}, ${delivery.city}, ${delivery.state}, ${delivery.country} - ${delivery.zipcode}`}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Billing Name:
          </Box>
          <Box>
            {`${delivery.firstName} ${delivery.lastName}`} <br />
            {delivery.email}
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone No:
          </Box>
          <Box>{delivery.phone}</Box>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* Shipping Details */}
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Address:
          </Box>
          {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.zipcode}`}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Shipping Name:
          </Box>
          <Box>
            {`${shippingAddress.firstName} ${shippingAddress.lastName}`} <br />
            {shippingAddress.email}
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>
            Phone No:
          </Box>
          <Box>{shippingAddress.phone}</Box>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      {/* Payment Details */}
      <Grid row container justifyContent="space-between" sx={{ px: 3, py: 1, typography: 'body2' }}>
        <Box>
          <Box component="span" sx={{ color: 'text.secondary' }}>
            Payment Method:
          </Box>
          {payment}
        </Box>
        <Box>
          <Label
            variant="soft"
            color={
              (paymentStatus === 'Pending' && 'info') ||
              (paymentStatus === 'Paid' && 'primary') ||
              (paymentStatus === 'Failed' && 'error') ||
              'default'
            }
          >
            {paymentStatus}
          </Label>
        </Box>
        <Box>
        {payment === 'COD' ? (
        <>
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {paymentStatus}
          </Button>
          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            arrow="top-right"
            sx={{ width: 140 }}
          >
            {statusOptions.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === status}
                onClick={() => {
                  popover.onClose();
                  onChangeStatus(option.value);
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </CustomPopover>
        </>
      ) : (
        <>{null}</>
      )}
        </Box>
      </Grid>

   
    </Card>
  );
}

PaymentDetailsInfo.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    profilePicture: PropTypes.string,
  }).isRequired,
  delivery: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    zipcode: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  payment: PropTypes.string.isRequired,
  shippingAddress: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    zipcode: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
  paymentStatus: PropTypes.string.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};
