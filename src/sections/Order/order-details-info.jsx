import PropTypes from 'prop-types';
import {
  Box,
  Link,
  Card,
  Stack,
  Button,
  Avatar,
  Divider,
  IconButton,
  CardHeader,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';

export default function OrderDetailsInfo({ customer, delivery, payment, shippingAddress }) {
  return (
    <Card>
      {/* Customer Details */}
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
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>Address:</Box>
          {`${delivery.address}, ${delivery.city}, ${delivery.state}, ${delivery.country} - ${delivery.zipcode}`}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>Billing Name:</Box>
          <Box>
            {`${delivery.firstName} ${delivery.lastName}`} <br />
            {delivery.email}
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>Phone No:</Box>
          <Box>{delivery.phone}</Box>
        </Stack>
      </Stack>
      
      <Divider sx={{ borderStyle: 'dashed' }} />
      
      {/* Shipping Details */}
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>Address:</Box>
          {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} - ${shippingAddress.zipcode}`}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>Shipping Name:</Box>
          <Box>
            {`${shippingAddress.firstName} ${shippingAddress.lastName}`} <br />
            {shippingAddress.email}
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', width: 120, flexShrink: 0 }}>Phone No:</Box>
          <Box>{shippingAddress.phone}</Box>
        </Stack>
      </Stack>
      
      <Divider sx={{ borderStyle: 'dashed' }} />
      
      {/* Payment Details */}
      <Stack direction="row" alignItems="center" sx={{ p: 3, typography: 'body2' }}>
        <Box component="span" sx={{ color: 'text.secondary', flexGrow: 1 }}>Payment Method:</Box>
        {payment}
      </Stack>
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.shape({
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
};
