// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      list: `${ROOTS.DASHBOARD}/product/list`,
      edit: `${ROOTS.DASHBOARD}/product/edit`,
    },
    category: {
      root: `${ROOTS.DASHBOARD}/category`,
      new: `${ROOTS.DASHBOARD}/category/new`,
      list: `${ROOTS.DASHBOARD}/category/list`,
      edit: `${ROOTS.DASHBOARD}/category/edit`,
    },
    order: `${ROOTS.DASHBOARD}/order`,
    payment: `${ROOTS.DASHBOARD}/payment`,
  },
};
