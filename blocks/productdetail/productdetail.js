function createListItem(productContainer, productData) {
  productContainer.innerHTML += `
      <div class="product-image-container border">
        <picture>
        <source type="image/webp" srcset="${productData[0].ProductImage}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
        <source type="image/webp" srcset="${productData[0].ProductImage}?width=750&amp;format=webply&amp;optimize=medium">
        <source type="image/jpeg" srcset="${productData[0].ProductImage}?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
        <img loading="eager" alt="" src="${productData[0].ProductImage}?width=750&amp;format=jpeg&amp;optimize=medium" width="1600" height="1066">
      </picture>
      </div>
      <div class="product-description-container border">
        <h1>${productData[0].ProductName}</h1>
        <div class="price">Starting at £${productData[0].ProductPrice}pppn</div>
        <p class="description">${productData[0].LongDescription}</p>
        <p class="button-container"><a href="/checkout?category=${productData[0].CategoryID}&product=${productData[0].ProductID}" title="Checkout" class="button product-detail-checkout-btn">Checkout</a></p>
      </div>


      


 `;
}

async function createList(jsonURL, val) {
  let pathName = null;
  if (val) {
    pathName = jsonURL;
  } else {
    pathName = new URL(jsonURL);
  }

  const fetchProductsData = await fetch(`${pathName}?sheet=products`);
  const productJSON = await fetchProductsData.json();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productParam = urlParams.has('product') && urlParams.get('product');
  const categoryParam = urlParams.has('category') && urlParams.get('category');
  const filteredData = productJSON.data.filter(
    (item) => item.CategoryID === categoryParam && item.ProductID === productParam,
  );
  const productDeailsContainer = document.createElement('div');
  productDeailsContainer.classList.add('productDetails-container');
  createListItem(productDeailsContainer, filteredData);

  return productDeailsContainer;
}

/**
 * loads and decorates the productCards
 * @param {Element} block The productCards block element
 */
export default async function decorate(block) {
  const products = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('productDetails');
  if (products) {
    parentDiv.append(await createList(products.href, null));
    products.replaceWith(parentDiv);
  }
}
