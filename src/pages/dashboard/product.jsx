import { Helmet } from 'react-helmet-async';

import ProductView from 'src/sections/Product/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product</title>
      </Helmet>

      <ProductView />
    </>
  );
}
