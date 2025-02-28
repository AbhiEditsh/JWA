import { Helmet } from 'react-helmet-async';

import { ProductEditView } from 'src/sections/Product/view/product-edit-view';

// ----------------------------------------------------------------------

export default function ProductEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product Edit</title>
      </Helmet>

      <ProductEditView />
    </>
  );
}
