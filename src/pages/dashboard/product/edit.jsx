import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import ProductEditView from 'src/sections/Product/view/product-edit-view';

// ----------------------------------------------------------------------
export default function ProductEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Edit</title>
      </Helmet>

      <ProductEditView id={`${id}`} />
    </>
  );
}
