import PropTypes from 'prop-types';
import {
  Checkbox,
  Button,
  MenuItem,
  TableRow,
  TableCell,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CategoryQuickEditForm from './category-quick-edit-form';
import axios from 'axios';
import { useGetCategoriesList } from 'src/api/categories';

export default function CategoryTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { ProductImage, name, description } = row;
  const { enqueueSnackbar } = useSnackbar();

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const router = useRouter();
  const { mutate } = useGetCategoriesList();

  const handleDeleteRow = async (id) => {
    console.log(id);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_AUTH_API}/api/admin/categories/delete/${id}`
      );

      console.log(response.data.message);
      enqueueSnackbar(response.data.message, { variant: 'success' });
      mutate()
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to delete category';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Error Details:', errorMessage);
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{index + 1}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={ProductImage} sx={{ mr: 2 }} />
        </TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{description}</TableCell>

        <TableCell align="right">
          <Tooltip title="Edit Category" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CategoryQuickEditForm
        currentCategory={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

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
            router.push(`/dashboard/category/${row._id}/edit`);
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
        title="Delete Category"
        content="Are you sure you want to delete this category?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRow(row._id);
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

CategoryTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool.isRequired,
  onEditRow: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};
