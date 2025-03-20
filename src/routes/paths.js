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
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
    },
    category: {
      root: `${ROOTS.DASHBOARD}/category`,
      new: `${ROOTS.DASHBOARD}/category/new`,
      list: `${ROOTS.DASHBOARD}/category/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/category/${id}/edit`,
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      list: `${ROOTS.DASHBOARD}/order/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/order/${id}/edit`,
    },
    payment: `${ROOTS.DASHBOARD}/payment`,
  },
};
