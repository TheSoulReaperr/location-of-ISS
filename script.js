const leafLet = new Mappa('Leaflet');
let map;
const API = 'https://api.wheretheiss.at/v1/satellites/25544';

let canvas;
let issImg;
let firstTime = true;
let pos;
let history = [];

function preload() {
  issImg = loadImage('iss200.png');
}

function setup() {
  canvas = createCanvas(windowWidth, 600);
  getData();
  setInterval(getData, 500);
}

function getData() {
  loadJSON(API, gotData);
}

function gotData(data) {
  if (firstTime) {
    const options = {
      lat: data.latitude,
      lng: data.longitude,
      zoom: 5,
      style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
    };
    map = leafLet.tileMap(options);
    map.overlay(canvas);
    map.onChange(render);
    firstTime = false;
  }
  history.push(data);
  render();
}

function render() {
  clear();
  strokeWeight(map.zoom()/2);
  stroke(100);
  noFill();
  beginShape();
  for (let data of history) {
    const pix = map.latLngToPixel(data.latitude, data.longitude);
    vertex(pix.x, pix.y);
  }
  endShape();
  const current = history[history.length - 1];
  const pix = map.latLngToPixel(current.latitude, current.longitude);
  imageMode(CENTER);
  image(issImg, pix.x, pix.y, 50, 32);
}
