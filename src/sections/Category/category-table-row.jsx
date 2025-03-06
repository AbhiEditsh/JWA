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

import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CategoryQuickEditForm from './category-quick-edit-form';
import { useRouter } from 'src/routes/hooks';

export default function CategoryTableRow({
  row,
  index,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { ProductImage, name, description } = row;

  const confirm = useBoolean();
  const quickEdit = useBoolean();
  const popover = usePopover();
  const router = useRouter();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>{index + 1}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={`${name}`} src={ProductImage} sx={{ mr: 2 }} />
        </TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{description}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap', align: 'center' }}>
          <Tooltip title="Category" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" sx={{ textAlign: 'center' }} />
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
        {/* Delete Option */}
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
        content="Are you sure you want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
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
