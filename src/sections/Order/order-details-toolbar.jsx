import PropTypes from 'prop-types';
import { Stack, Button, MenuItem, IconButton, Typography } from '@mui/material';
import { RouterLink } from 'src/routes/components';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function OrderDetailsToolbar({ 
  orderNo,
  status,
  backLink,
  statusOptions,
  onChangeStatus
}) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Stack spacing={1} direction="row" alignItems="flex-start">
          <IconButton component={RouterLink} href={backLink}>
            <Iconify icon="eva:arrow-ios-back-fill" />
          </IconButton>
          <Stack spacing={0.5}>
            <Typography variant="h4">Order {orderNo}</Typography>
            <Stack spacing={1} direction="row" alignItems="center">
              <Label
                variant="soft"
                color={
                  (status === 'Pending' && 'warning') ||
                  (status === 'Processing' && 'info') ||
                  (status === 'Shipped' && 'primary') ||
                  (status === 'Delivered' && 'success') ||
                  (status === 'Cancelled' && 'error') ||
                  'default'
                }
              >
                {status}
              </Label>
            </Stack>
          </Stack>
        </Stack>

        <Stack flexGrow={1} spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
          <Button
            color="inherit"
            variant="outlined"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Button>
          <Button color="inherit" variant="outlined" startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}>
            Print
          </Button>
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right" sx={{ width: 140 }}>
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
  );
}

OrderDetailsToolbar.propTypes = {
  orderNo: PropTypes.string.isRequired,
  backLink: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  statusOptions: PropTypes.array.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};
