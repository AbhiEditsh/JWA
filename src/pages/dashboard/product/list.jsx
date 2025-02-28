import { Helmet } from 'react-helmet-async';

import ProductListView from 'src/sections/Product/view/product-list-view';


// ----------------------------------------------------------------------

export default function ProductListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>
      <ProductListView/>
    </>
  );
}
