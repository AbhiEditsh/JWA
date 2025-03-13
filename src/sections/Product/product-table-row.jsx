import PropTypes from 'prop-types';
import { Button, MenuItem, TableRow, TableCell, IconButton, Avatar, Checkbox } from '@mui/material';
import axios from 'axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { useGetProducts } from 'src/api/product';

export default function ProductTableRow({
  row,
  index,
  selected,
  onSelectRow,
  onEditRow,
  onDeleteRow,
}) {
  const { ProductImage, name, category, Available, price, gender, oldPrice, rating, sku, _id } = row;
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
      const errorMessage = error?.response?.data?.message || 'Failed to delete category';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Error Details:', errorMessage);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{index + 1}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={ProductImage} sx={{ mr: 2 }} />
        </TableCell>

        <TableCell>{name}</TableCell>
        {/* Display category name instead of the entire object */}
        <TableCell>{category?.name || '-'}</TableCell>
        <TableCell>{Available}</TableCell>
        <TableCell>{price}</TableCell>
        <TableCell>{oldPrice}</TableCell>
        <TableCell>{rating}</TableCell>
        <TableCell>{sku}</TableCell>
        <TableCell>{gender}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure you want to delete?"
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

ProductTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};




