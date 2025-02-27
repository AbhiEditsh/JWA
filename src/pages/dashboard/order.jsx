import { Helmet } from 'react-helmet-async';

import OrderView from 'src/sections/Order/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order</title>
      </Helmet>

      <OrderView />
    </>
  );
}
