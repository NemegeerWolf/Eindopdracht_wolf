'use strict';

const API_URL= " http://api.open-notify.org/iss-now.json"

const provider = ['http://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'];
const copyright = ['&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>','Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>', 'map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'];

let arr_coords = [0,0]

let map, layergroup, marker

let lock_buttom ;

let markerIcon ;

// get from url 
const getJsonFromUrl =(url) => fetch(url).then((r) => r.json());

const maakMarker = async function(coords){
  const arr__coords = coords.split(",");
  
  layergroup.clearLayers();
  marker = L.marker(arr__coords, {icon: markerIcon, riseOnHover: true,}).addTo(map);
  marker.bindPopup(`<h3>ISS</h3><em>${coords}</em>`).openPopup()
  // map.setView(arr_coords);
  
}

const moveMarker = async function(coords){
  const arr__coords = coords.split(",");
  
  marker.setLatLng(arr__coords)
  marker.bindPopup(`<h3>ISS</h3><em>latitude: ${arr__coords[0]} longitude: ${arr__coords[0]}</em>`)
  if(lock_buttom.checked){
  map.flyTo(arr_coords);
  }
  //map.setView(arr_coords);
}



const getCoords = async function(){

  
  let json = await getJsonFromUrl(API_URL)
  
  console.log(json.iss_position)
  arr_coords[0] = json.iss_position.latitude
  arr_coords[1] = json.iss_position.longitude
  
    moveMarker(arr_coords[0] + "," +arr_coords[1]);
  
  
  
   
}

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

const init = function () {
  console.log('init initiated!');

  markerIcon = L.icon({
    iconUrl: 'img/ISS.svg',
    shadowUrl: 'img/iss-shadow.svg',
   

    iconSize:     [50, 50], // size of the icon
    shadowSize:   [20, 20], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [-40, -40],  // the same for the shadow
    popupAnchor:  [20, 0] // point from which the popup should open relative to the iconAnchor
});



  map = L.map("mapid", {zoomControl: false}).setView(arr_coords);

  map.setZoom(5);

  var zoomOptions = {
    
    position: "bottomleft",
 };
 var zoom = L.control.zoom(zoomOptions);   // Creating zoom control
  let i = zoom.getContainer()
  zoom.addTo(map)
  
  L.tileLayer(provider[0], {attribution: copyright[0]}).addTo(map);
  layergroup = L.layerGroup().addTo(map);
  maakMarker(arr_coords[0] + "," +arr_coords[1]);
  getCoords();
  map.setView(arr_coords);
//   let list = [];
//   for(let i = 0; i<180; i++){
//     list.push([Math.sin(51.6*i),]);
//   };
//   var latlngs = list;
//   [
//     [45.51, -122.68],
//     [37.77, -122.43],
//     [34.04, -118.2]
// ];

// var polyline = L.polyline(latlngs, {color: 'red', smoothFactor: 1.0}).addTo(map);

// zoom the map to the polyline

  // map.addEventListener("zoom", function(){
  //   map.flyTo(arr_coords);
    
  // });
  lock_buttom = document.querySelector(".js-lock_buttom");

  map.addEventListener("dragstart", function(){
    lock_buttom.checked = false;
  })

  document.querySelectorAll(".js-map-button").forEach(element => {
    element.addEventListener("click", function(){
      console.log("hi");  
      map.removeLayer(layergroup);
      map.eachLayer(function(layer){
      map.removeLayer(layer);
    });
      L.tileLayer(provider[element.value], {attribution: copyright[element.value]}).addTo(map);
      layergroup = L.layerGroup().addTo(map);
      maakMarker(arr_coords[0] + "," +arr_coords[1]);
      
      getCoords();
    })
    
  

  });

  lock_buttom.addEventListener("click", function(){
    if(this.checked){
      console.log("pipi")
      map.flyTo(arr_coords);
      map.setZoom(5)
    }
  });




  
  
    //  arr_coords[0] += 0.001;
    //  arr_coords[1] += 0.00001;
    //  console.log(`${arr_coords[0]}, ${arr_coords[1]}`)
    //  maakMarker(`${arr_coords[0]}, ${arr_coords[1]}`, "iss", "iss");
    // sleep(1000)

    
    
  
};



document.addEventListener('DOMContentLoaded', init);

setInterval(getCoords, 100)
