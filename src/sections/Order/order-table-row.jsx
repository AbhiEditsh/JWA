import PropTypes from 'prop-types';
import {
  Button,
  MenuItem,
  Box,
  Typography,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Checkbox,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { useGetProducts } from 'src/api/product';
import { useState } from 'react';

export default function OrderTableRow({ row, index, selected, onSelectRow, onEditRow }) {
  const { userId, paymentMethod, paymentStatus, amount, status, _id, items = [] } = row;
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const popover = usePopover();
  const router = useRouter();
  const { mutate } = useGetProducts();

  const handleDeleteRow = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_AUTH_API}/api/product/delete/${id}`
      );
      enqueueSnackbar(response.data.message, { variant: 'success' });
      mutate();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to delete product';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Error Details:', errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning'; // Yellow
      case 'Processing':
        return 'info'; // Blue
      case 'Shipped':
        return 'primary'; // Dark Blue
      case 'Delivered':
        return 'success'; // Green
      case 'Cancelled':
        return 'error'; // Red
      default:
        return 'default'; // Gray
    }
  };

  return (
    <>
      {/* Main Table Row */}
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center">{index + 1}</TableCell>
        <TableCell align="center">{userId?.username || 'N/A'}</TableCell>
        <TableCell align="center">
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Iconify icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
          </IconButton>
        </TableCell>

        <TableCell align="center">{paymentMethod || 'N/A'}</TableCell>
        <TableCell align="center">{paymentStatus || 'N/A'}</TableCell>
        <TableCell align="center">
          <Chip label={status} color={getStatusColor(status)} variant="Filled" size='small'/>
        </TableCell>
        <TableCell align="center">{amount || 'N/A'}</TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Expandable Details Row */}
      <TableRow>
        <TableCell colSpan={8} sx={{ p: 0, borderBottom: open ? '1px solid #ddd' : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              {items.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {items.map((item, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{ mt: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}
                    >
                      <Avatar
                        alt={item?.productId?.name || 'No Image'}
                        src={item?.productId?.ProductImage || ''}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography variant="body2">{item?.productId?.name || 'No Name'}</Typography>
                      <Typography variant="body2">
                        Quantity : {item?.quantity || 'No quantity'}
                      </Typography>
                      <Typography variant="body2" sx={{ ml: 'auto' }}>
                        ₹{item?.productId?.price || '0'}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
                  No items available.
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Actions Menu */}
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            router.push(`/dashboard/product/${_id}/edit`);
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
      </CustomPopover>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete this product?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(_id);
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

OrderTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
};
