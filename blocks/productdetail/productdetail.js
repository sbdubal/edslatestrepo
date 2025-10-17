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
    (item) =>
      item.CategoryID === categoryParam && item.ProductID === productParam
  );
  const productDeailsContainer = document.createElement('div');
  productDeailsContainer.classList.add('productDetails_container');
  createListItem(productDeailsContainer, filteredData);
  const product = productJSON.data.find(
    (item) =>
      item.CategoryID === categoryParam && item.ProductID === productParam,
  );
  
  product &&
    (window.digitalData = {
      pageName: "Productpage",
      product: {  
        productName: product.ProductName,
        productPrice: product.ProductPrice,
        productValue: parseInt(product.ProductID.split("_")[1]),
      },
      category: {
        categoryValue: product.CategoryID.split("_")[1],
      },
      pageURL: window.location.href,
    });
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


// <ul data-aue-resource="urn:aemconnection:/content/example/list" data-aue-type="container">
//       <li data-aue-resource="urn:aemconnection/content/example/listitem" data-aue-type="component">
//         <p data-aue-prop="name" data-aue-type="text">Jane Doe</p>
//         <p data-aue-prop="title" data-aue-type="text">Journalist</p>
//         <img data-aue-prop="avatar" src="https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg" data-aue-type="image" alt="avatar"/>
//       </li>

//       <li data-aue-resource="urn:fcsconnection:/documents/mytext" data-aue-type="component">
//         <p data-aue-prop="name" data-aue-type="text">John Smith</p>
//         <p data-aue-resource="urn:aemconnection/content/example/another-source" data-aue-prop="title" data-aue-type="text">Photographer</p>
//         <img data-aue-prop="avatar" src="https://www.adobe.com/content/dam/cc/icons/Adobe_Corporate_Horizontal_Red_HEX.svg" data-aue-type="image" alt="avatar"/>
//       </li>
//     </ul>

    
//     <div data-aue-resource="urn:aemconnection:/content/dam/ddxadobehackathon2024/item1" data-aue-type="component">
//   <p data-aue-prop="fullName" data-aue-type="textField">Jane Doe</p>
//         <p data-aue-prop="profession" data-aue-type="textField">Journalist</p>
//     </div>