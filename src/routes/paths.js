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
    category: `${ROOTS.DASHBOARD}/category`,
    order: `${ROOTS.DASHBOARD}/order`,
    payment: `${ROOTS.DASHBOARD}/payment`,
  },
};
