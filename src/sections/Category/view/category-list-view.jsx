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
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
import axios from 'axios';
import { useGetCategoriesList } from 'src/api/categories';
import CategoryTableRow from '../category-table-row';
import CategoryTableToolbar from '../category-table-toolbar';

const TABLE_HEAD = [
  { id: 'srNo', label: 'Sr No', width: '5%' },
  { id: 'Image', label: 'Category Image', width: '10%' },
  { id: 'name', label: 'Category Name', width: '25%' },
  { id: 'description', label: 'Category Description', width: '50%' },
  { id: 'Action', label: 'Action', width: '5%' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

function CategoryListView() {
  const { enqueueSnackbar } = useSnackbar();
  const table = useTable();
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const { categories, categoriesError, mutate } = useGetCategoriesList();

  useEffect(() => {
    if (categoriesError) {
      enqueueSnackbar('Failed to fetch categories', { variant: 'error' });
    }
  }, [categoriesError, enqueueSnackbar]);

  const dataFiltered = applyFilter({
    categoryData: categories || [],
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 56 : 56 + 20;

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

  const handleDeleteRows = useCallback(async () => {
    try {
      const selectedIds = [...table.selected];
      let URL;
      let payload;
      let response;
  
      if (selectedIds.length === 1) {
        const id = selectedIds[0];
        URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/delete/${id}`;
        response = await axios.delete(URL);
      } else if (selectedIds.length > 1) {
        URL = `${import.meta.env.VITE_AUTH_API}/api/admin/categories/multi-delete`;
        payload = { ids: selectedIds };
        response = await axios.delete(URL, { data: payload });
      } else {
        enqueueSnackbar('No categories selected for deletion', { variant: 'warning' });
        return;
      }
  
      if (response.status === 200) {
        enqueueSnackbar(response.message || 'Categories deleted successfully', {
          variant: 'success',
        });
        mutate();
        confirm.onFalse();
      } else {
        enqueueSnackbar(response.message || 'Failed to delete categories', {
          variant: 'error',
        });
      }
    } catch (error) {
      console.error('Failed to delete categories', error);
      enqueueSnackbar('Failed to delete categories', { variant: 'error' });
    }
  }, [ enqueueSnackbar, mutate, confirm, table]);
  


  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.category.edit(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Category List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Category', href: paths.dashboard.category.list },
            { name: 'Category List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.category.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Category
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <CategoryTableToolbar filters={filters} onFilters={handleFilters} />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered?.length}
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
                  rowCount={categories?.length}
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
                      <CategoryTableRow
                        key={row._id}
                        index={index}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRows([row._id])}
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

// ----------------------------------------------------------------------

export default CategoryListView;

function applyFilter({ categoryData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = categoryData.map((el, index) => [el, index]);
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
