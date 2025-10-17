function createListItem(list, productData) {
  productData.forEach((element) => {
    const listItem = list.appendChild(document.createElement('li'));
    listItem.innerHTML += `<div class="cards-card-image">
  <p>
    <picture>
      <source type="image/webp" srcset="${element.ProductImage}?width=750&amp;format=webply&amp;optimize=medium">
      <img loading="lazy" alt="" src="${element.ProductImage}?width=750&amp;format=jpeg&amp;optimize=medium">
    </picture>
  </p>
  <h5 id="luxury-resorts">${element.ProductName}</h5>
  </div><div class="cards-card-body">
  <p><strong>Starting at ${element.ProductPrice}pp</strong></p>
  <p>${element.ShortDescription}</p>
  <p class="button-container"><a href="/productdetail?category=${element.CategoryID}&product=${element.ProductID}" title="Product Page" class="button">See Product Details</a></p>
  </div>`;
  });
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

  // check is checkout form
  const currentUrl = window.location.href;
  const isCheckout = currentUrl.includes('checkout');

  let filteredData;

  if (isCheckout) {
    filteredData = productJSON.data.filter(
      (item) => item.CategoryID === categoryParam && item.ProductID === productParam,
    );
    window.checkoutProductData = {
      productValue: parseInt(filteredData[0].ProductID.split('_')[1]),
      productName: filteredData[0].ProductName,
      productPrice: filteredData[0].ProductPrice,
      categoryValue: filteredData[0].CategoryID.split('_')[1],
    };

    window.digitalData = {
      pageName: "Checkoutpage",
      product: {
        productName: window.checkoutProductData.productName,
        productPrice: window.checkoutProductData.productPrice,
        productValue: window.checkoutProductData.productValue,
      },
      category: {
        categoryValue: window.checkoutProductData.categoryValue,
      },
      pageURL: window.location.href,
    };
  } else if (productParam) {
    filteredData = productJSON.data.filter(
      (item) => item.CategoryID === categoryParam && item.ProductID !== productParam,
    );
  } else {
    filteredData = productJSON.data.filter(
      (item) => item.CategoryID === categoryParam,
    );
  }
  const list = document.createElement('ul');
  createListItem(list, filteredData);

  return list;
}

/**
 * loads and decorates the productCards
 * @param {Element} block The productCards block element
 */
export default async function decorate(block) {
  const products = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('productCards');
  if (products) {
    parentDiv.append(await createList(products.href, null));
    products.replaceWith(parentDiv);
  }
}
