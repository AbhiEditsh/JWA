import { Helmet } from 'react-helmet-async';

import PaymentListView from 'src/sections/Payment/view/payment-list-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Payment List</title>
      </Helmet>

      <PaymentListView />
    </>
  );
}
