function createRadioButtons(list, wrapper, onChange) {
  if (!list) return;

  const fieldset = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'Select a tag';
  legend.className = 'visually-hidden';
  fieldset.appendChild(legend);

  const listItems = list.querySelectorAll('li');

  listItems.forEach((item, index) => {
    const itemText = item.textContent.trim();
    const itemValue = itemText.toLowerCase();

    // Create radio button
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'tms-selector';
    radio.id = `tms-selector-${index}`;
    radio.value = itemValue;
    radio.className = 'tms-radio';

    // Set default selection
    if (itemValue === 'adobe') {
      radio.checked = true;
    }

    // Create label
    const label = document.createElement('label');
    label.htmlFor = radio.id;
    label.textContent = itemText;
    label.className = 'tms-radio-label';

    // Create wrapper for radio + label
    const formElementWrapper = document.createElement('div');
    formElementWrapper.className = 'tms-radio-wrapper';
    formElementWrapper.append(radio, label);

    // Add event listener with delegation
    if (onChange) {
      radio.addEventListener('change', onChange);
    }

    fieldset.appendChild(formElementWrapper);
  });

  wrapper.appendChild(fieldset);
  list.replaceWith(wrapper);
}

/**
 * Handles radio button change events
 * @param {Event} event - The change event
 * @param {HTMLElement} profileLink - The profile link element to show/hide
 */
function handleRadioChange(event, profileLink) {
  const selectedValue = event.target.value;

  if (profileLink) {
    profileLink.style.display = selectedValue === 'salesforce' ? 'none' : 'block';
  }
}

export default function decorate(block) {
  // hide header and footer
  document.querySelector('header').style.display = 'none';
  document.querySelector('footer').style.display = 'none';

  // Get the last ul element
  const lastList = block.querySelector('ul:last-of-type');

  if (!lastList) {
    return; // Exit early if no list found
  }

  // Create radio button wrapper
  const radioBtnWrapper = document.createElement('div');
  radioBtnWrapper.classList.add('tms-radio-buttons-wrapper');

  // Get profile link element (scoped to block to avoid global queries)
  const createProfileLink = block.querySelector('.button-container')
                           || document.querySelector('.button-container');

  // Create radio buttons with callback
  createRadioButtons(lastList, radioBtnWrapper, (event) => {
    handleRadioChange(event, createProfileLink);
  });

  // Set initial state based on default selection
  const defaultRadio = radioBtnWrapper.querySelector('input[type="radio"]:checked');
  if (defaultRadio && createProfileLink) {
    handleRadioChange({ target: defaultRadio }, createProfileLink);
  }
}
