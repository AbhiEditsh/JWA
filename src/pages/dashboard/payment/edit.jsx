import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import PaymentEditView from 'src/sections/Payment/view/order-edit-view';

// ----------------------------------------------------------------------
export default function OrderEditPage() {
  const params = useParams();

  const { id } = params;
  return (
    <>
      <Helmet>
        <title> Dashboard:  Edit</title>
      </Helmet>

      <PaymentEditView id={`${id}`} />
    </>
  );
}
