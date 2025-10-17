function createListItem(HeroContainer, categoriesJSON) {
  HeroContainer.innerHTML += `
      <div>
        <div>
          <picture>
              <source type="image/webp" srcset="${categoriesJSON[0].CategoryImage}?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
              <source type="image/webp" srcset="${categoriesJSON[0].CategoryImage}?width=750&amp;format=webply&amp;optimize=medium">
              <source type="image/jpeg" srcset="${categoriesJSON[0].CategoryImage}?width=2000&amp;format=jpeg&amp;optimize=medium" media="(min-width: 600px)">
              <img loading="eager" alt="" src="${categoriesJSON[0].CategoryImage}?width=750&amp;format=jpeg&amp;optimize=medium" width="1600" height="1066">
            </picture>
            <h1 id="welcome-to-cx-travel">Check out our ${categoriesJSON[0].CategoryName} </h1>
          </div>
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

  const fetchcategoriesData = await fetch(`${pathName}?sheet=categories`);
  const categoriesJSON = await fetchcategoriesData.json();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const categoryParam = urlParams.has('category') && urlParams.get('category');
  const filteredData = categoriesJSON.data.filter(
    (item) => item.CategoryID === categoryParam,
  );

  const HeroContainer = document.createElement('div');
  HeroContainer.classList.add('hero');
  createListItem(HeroContainer, filteredData);

  filteredData &&
    (window.digitalData = {
      pageName: "Categorypage",
      category: {
        categoryName: filteredData[0].CategoryName,
        categoryValue: filteredData[0].CategoryID.split("_")[1]
      },
      pageURL: window.location.href,
    });

  return HeroContainer;
}

/**
 * loads and decorates the ctaegoryHero
 * @param {Element} block The ctaegoryHero block element
 */
export default async function decorate(block) {
  const ctaegoryHero = block.querySelector('a[href$=".json"]');
  const parentDiv = document.createElement('div');
  parentDiv.classList.add('hero-wrapper');
  if (ctaegoryHero) {
    parentDiv.append(await createList(ctaegoryHero.href, null));
    ctaegoryHero.replaceWith(parentDiv);
  }
}
