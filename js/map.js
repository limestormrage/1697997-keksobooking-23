import { similarOffers } from './data.js';
import { enableForm } from './lock-form.js';

// global L:readonly
const DEFAULT_ADDRESS = {
  lat: 35.6895,
  lng: 139.692,
};
const MAP_SCALE = 13;
const MAP_IMAGE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP__COPYRIGHT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const MAIN_PIN_SETTING = {
  iconUrl: '../img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
};
const ADS_PIN_SETTING = {
  iconUrl: '../img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
};

const addressInput = document.querySelector('#address');
const map = L.map('map-canvas');


//* Функция показа адреса
const addressValue = ({lat, lng}) => {
  addressInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

//* Настройка карты
const initializationMap = () => {
  map.on('load', () => {
    enableForm();
    addressValue(DEFAULT_ADDRESS);
  })
    .setView({
      lat: DEFAULT_ADDRESS.lat,
      lng: DEFAULT_ADDRESS.lng,
    }, MAP_SCALE);
};

L.tileLayer(
  MAP_IMAGE,
  {
    attribution: MAP__COPYRIGHT,
  },
).addTo(map);


//* Настройка главного маркера
const mainPinIcon = L.icon(
  {
    iconUrl: MAIN_PIN_SETTING.iconUrl,
    iconSize: MAIN_PIN_SETTING.iconSize,
    iconAnchor: MAIN_PIN_SETTING.iconAnchor,
  },
);

const mainMarker = L.marker(
  {
    lat: DEFAULT_ADDRESS.lat,
    lng: DEFAULT_ADDRESS.lng,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainMarker.on('move', (evt) => {
  addressValue(evt.target.getLatLng());
});

///////////////////////////////////////////////*
const templateCard = document.querySelector('#card').content.querySelector('.popup');
const typesName = {
  palace: 'Дворец',
  flat: 'Квартира',
  house: 'Дом',
  bungalow: 'Бунгало',
  hotel: 'Отель',
};

const createPoint = (card) => {

  const cardElement = templateCard.cloneNode(true);
  //* поиск элементов карточки
  const title = cardElement.querySelector('.popup__title');
  const address = cardElement.querySelector('.popup__text--address');
  const price = cardElement.querySelector('.popup__text--price');
  const type = cardElement.querySelector('.popup__type');
  const capacity = cardElement.querySelector('.popup__text--capacity');
  const time = cardElement.querySelector('.popup__text--time');
  const description = cardElement.querySelector('.popup__description');
  const avatar = cardElement.querySelector('.popup__avatar');

  //* добавляем значение или удаляем пустой элемент
  title.textContent = card.offer.title || title.remove();
  address.textContent = card.offer.address || address.remove();
  price.textContent = `${card.offer.price} ₽/ночь` || price.remove();
  type.textContent = typesName[card.offer.type] || type.remove();
  capacity.textContent = `${card.offer.rooms} комнаты для ${card.offer.guests} гостей` || capacity.remove();
  time.textContent = `Заезд после ${card.offer.checkin}, выезд до ${card.offer.checkout}` || time.remove();
  description.textContent = card.offer.description || description.remove();
  avatar.src = card.author.avatar || '../img/avatars/default.png';

  //* создание списка фич
  const featuresList = cardElement.querySelector('.popup__features');
  featuresList.textContent = '';
  const modifiers = card.offer.features.map((feature) => `popup__feature--${feature}`);
  const fragment = document.createDocumentFragment();
  modifiers.forEach((element) => {
    const newElement = document.createElement('li');
    newElement.classList.add('popup__feature', element);
    fragment.appendChild(newElement);
  });
  featuresList.appendChild(fragment);
  featuresList.children.length || featuresList.remove();
  //* создание списка фотографий
  const photosList = cardElement.querySelector('.popup__photos');
  const photo = cardElement.querySelector('.popup__photo');
  const photos = card.offer.photos.map((img) => img);
  const photoFragment = document.createDocumentFragment();
  photosList.textContent = '';
  photos.forEach((element) => {
    const photoElement = photo.cloneNode(true);
    photoElement.src = element;
    photoFragment.appendChild(photoElement);
  });
  photosList.appendChild(photoFragment);
  photosList.children.length || photosList.remove();

  return cardElement;
};

similarOffers(10).forEach((element) => {
  const {lat, lng} = element.location;
  //* Настройка меток объявлений
  const adsMarkerPin = L.icon(
    {
      iconUrl: ADS_PIN_SETTING.iconUrl,
      iconSize: ADS_PIN_SETTING.iconSize,
      iconAnchor: ADS_PIN_SETTING.iconAnchor,
    },
  );
  const adsMarker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon: adsMarkerPin,
    },
  );
  adsMarker
    .addTo(map)
    .bindPopup(createPoint(element));
});

const resetMap = () => {
  mainMarker.setLatLng(
    {
      lat: DEFAULT_ADDRESS.lat,
      lng: DEFAULT_ADDRESS.lng,
    },
  );
  map.setView(
    {
      lat: DEFAULT_ADDRESS.lat,
      lng: DEFAULT_ADDRESS.lng,
    }, MAP_SCALE);
};

mainMarker.addTo(map);
export {initializationMap, resetMap};
