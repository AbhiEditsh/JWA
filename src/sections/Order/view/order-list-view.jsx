import { useState, useCallback, useEffect } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import axios from 'axios';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';

import { useGetProducts } from 'src/api/product';
import OrderTableRow from '../order-table-row';
import OrderTableToolbar from '../order-table-toolbar';
import { useGetOrder } from 'src/api/order';

const TABLE_HEAD = [
  { id: 'Sr no', label: 'Sr No', align: 'center' },
  { id: 'username', label: 'username', align: 'center' },
  { id: 'product', label: 'Product', align: 'center' },
  { id: 'paymentMethod', label: 'Payment Method', align: 'center' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'amount', label: 'Amount', align: 'center' },
  { id: 'Action', label: 'Action', width: 88 },
];
const defaultFilters = {
  name: '',
  status: 'all',
};

function OrderListView() {
  const table = useTable();
  const { enqueueSnackbar } = useSnackbar();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const { order, orderError, mutate } = useGetOrder();

  useEffect(() => {
    if (orderError) {
      enqueueSnackbar('Failed to fetch Order', { variant: 'error' });
    }
  }, [orderError, enqueueSnackbar]);

  // Filter and sort the product data
  const dataFiltered = applyFilter({
    orderData: order || [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 76;
  const canReset = !!filters.name || filters.status !== 'all';
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  // Handle deletion for one or multiple rows
  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIds = [...table.selected];
      let URL;
      let payload;
      let response;

      if (selectedIds.length === 1) {
        const id = selectedIds[0];
        URL = `${import.meta.env.VITE_AUTH_API}/api/product/delete/${id}`;
        response = await axios.delete(URL);
      } else if (selectedIds.length > 1) {
        URL = `${import.meta.env.VITE_AUTH_API}/api/product/multi-delete`;
        payload = { ids: selectedIds };
        response = await axios.delete(URL, { data: payload });
      } else {
        enqueueSnackbar('No products selected for deletion', { variant: 'warning' });
        return;
      }

      if (response.status === 200) {
        enqueueSnackbar(response.data.message || 'Products deleted successfully', {
          variant: 'success',
        });
        mutate();
        confirm.onFalse();
      } else {
        enqueueSnackbar(response.data.message || 'Failed to delete Products', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to delete Products', error);
      enqueueSnackbar('Failed to delete Products', { variant: 'error' });
    }
  }, [enqueueSnackbar, mutate, confirm, table]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Order List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Order', href: paths.dashboard.order.list },
            { name: 'Order List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Product
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <OrderTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row._id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={order?.length || 0}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row._id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <OrderTableRow
                        key={row._id}
                        index={index}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRows(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{table.selected.length}</strong> items?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows}>
            Delete
          </Button>
        }
      />
    </>
  );
}

export default OrderListView;

// ----------------------------------------------------------------------
// Helper function to filter and sort product data

function applyFilter({ orderData, comparator, filters }) {
  const { status, name } = filters;

  // Stabilize the sorting
  const stabilizedThis = orderData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  let filteredData = stabilizedThis.map((el) => el[0]);

  if (name) {
    filteredData = filteredData.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }
  return filteredData;
}
