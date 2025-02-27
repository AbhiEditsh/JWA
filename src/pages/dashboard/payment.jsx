import { Helmet } from 'react-helmet-async';

import PaymentView from 'src/sections/Payment/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Payment</title>
      </Helmet>

      <PaymentView />
    </>
  );
}
