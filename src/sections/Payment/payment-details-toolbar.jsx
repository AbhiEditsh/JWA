import PropTypes from 'prop-types';
import { Stack, IconButton, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';

export default function PaymentDetailsToolbar({ orderNo, backLink }) {

  return (
    <>
      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
          <Stack spacing={0.5}>
            <Typography variant="h4">Order {orderNo}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}

PaymentDetailsToolbar.propTypes = {
  orderNo: PropTypes.string.isRequired,
  backLink: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  statusOptions: PropTypes.array.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};
