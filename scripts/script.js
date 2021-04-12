/*
Project: PROG 5075 ASSIGNMENT 5 - Covid-19 Vaccination Clinics Toronto
Title: script.js
Purpose: WebMap using Leaflet
Author: Emily Holdsworth
Date: March 2021
 */

'use strict';

function init() {
    //create new map using Leaflet
    var mymap = L.map('mapid').setView([43.724988, -79.360577], 11);

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

    //vaccine site options
    var vaccineSiteOptions = {
        radius: 8,
        fillColor: "#ED008C",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //add vaccine clinic site layer to map
    var siteLayer = L.geoJSON(vaccineSites,{
        pointToLayer: function (feature,latlng) {
            return L.circleMarker(latlng,vaccineSiteOptions);
        },
        //create popup: name, type, hours, info
        onEachFeature: function(feature,layer) {
            layer.bindPopup('<b>'+feature.properties.locationName+'</b></br></br>'+ '<b>Location Type: </b>'+ feature.properties.locationType +'</br>' + '<b>Hours: </b>'+ feature.properties.hours+'</br>'+ '<b>Info: </b>' + feature.properties.info);
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

    //create control for mouse position
    mymap.on('mousemove',coordinates)

    function coordinates(e) {
        //send coordinates (latlng) to div in footer
        let el = document.querySelector('#myposition')
        el.innerHTML = e.latlng.lng.toFixed(4) + ', ' + e.latlng.lat.toFixed(4);
    }

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


}
