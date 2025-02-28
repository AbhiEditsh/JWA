import { Helmet } from 'react-helmet-async';

import { ProductCreateView } from 'src/sections/Product/view/product-create-view';


// ----------------------------------------------------------------------

 function ProductCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new Product</title>
      </Helmet>

      <ProductCreateView />
    </>
  );
}

export default ProductCreatePage;
