/*
	Title: script.js
	Purpose: JS for Toronto Vaccination WebMap
	Author: Emily Holdsworth
	Date: April 2021
 */

'use strict';
var mymap;

function init() {

    //create new map using Leaflet
    mymap = new L.map('mapid');
    mymap.setView([43.724988, -79.360577], 11);

    //wards site options
    var wardOptions = {
        "color": "#01588E",
        "weight": 1,
        "opacity": 0.8
    };

    //add wards layer to map
    var wardLayer = L.geoJSON(wards, {
        style: wardOptions,
        //create popup: ward name
        onEachFeature: function(feature,layer) {
            layer.bindPopup(feature.properties.AREA_NAME);
        }
    }).addTo(mymap);

    //add vaccine clinic site layer to map
    var siteLayer = L.geoJSON(vaccineSites,{
        pointToLayer: function (feature,latlng) {
            if (feature.properties.locationType === 'Pharmacy Immunization Site') {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#01588E",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            } else if(feature.properties.locationType === "Hospital Immunization Clinic") {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#ED008C",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }else if(feature.properties.locationType === "City-operated Immunization Clinic") {
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#EC9F09",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            } else {
                return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "rgba(0,0,0,0.2)",
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        },
        //create popup: name, type, hours, info
        onEachFeature: function(feature,layer) {
            layer.bindPopup('<b>'+feature.properties.locationName+'</b></br></br>'+'<b>Address: </b>'+ feature.properties.address+'<br>'+ '<b>Location Type: </b>'+ feature.properties.locationType +'</br>' + '<b>Hours: </b>'+ feature.properties.hours+'</br><br>'+ '<b>Info: </b>' + feature.properties.info);
        }
    }).addTo(mymap);

    //generate tile layers using mapbox basemap
    var darkLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZW1pbHlob2xkc3dvcnRoIiwiYSI6ImNrbW5xbmlnazA0YnQycnMzZWlyOWo5Y28ifQ.iiuRnemhh7BDGR2cihcuQw'
    }).addTo(mymap);

    //generate second basemap using mapbox
    var lightLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiZW1pbHlob2xkc3dvcnRoIiwiYSI6ImNrbW5xbmlnazA0YnQycnMzZWlyOWo5Y28ifQ.iiuRnemhh7BDGR2cihcuQw'
    }).addTo(mymap);

    //create scale bar
    L.control.scale({
        imperial: false
    }).addTo(mymap);

    //create base maps variable
    var baseMaps = {
        "Dark": darkLayer,
        "Light": lightLayer
    };
    //create layers variable
    var layers = {
        "Vaccination Sites": siteLayer,
        "Wards": wardLayer
    };

    //create layer control
    L.control.layers(baseMaps,layers).addTo(mymap)

    //create legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function () {
        let div = L.DomUtil.create("div","legend");
        div.innerHTML =
            '<i class = "circle" style = "background-color: #ED008C"></i>Hospital<br>' +
            '<i class = "circle" style = "background-color: #01588E"></i>Pharmacy<br>' +
            '<i class = "circle" style = "background-color: #EC9F09"></i>City Site<br>';
        return div;
    };
    legend.addTo(mymap);

}
