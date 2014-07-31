var proj4 = require('proj4');
var csv = require('csv');
var fs = require('fs');

// http://spatialreference.org/ref/esri/102718/
// http://spatialreference.org/ref/esri/102718/proj4js/
var nystateplane = '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs';

// http://spatialreference.org/ref/epsg/4326/
// http://spatialreference.org/ref/epsg/4326/proj4js/
var latlng = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';

// Empty GeoJSON Feature Collection
// http://geojson.org/geojson-spec.html#feature-collection-objects
var graffiti = {
  type: 'FeatureCollection',
  features: []
};

fs.createReadStream('Graffiti_Locations.csv')
  .pipe(csv.parse({
    columns: ['address','borough','communityBoard','policePrecinct','cityCouncilDistrict','created','status','action','closed','x','y']
  }))
  .on('data', function (data) {
    if(data.x && data.y){
      graffiti.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates:proj4(nystateplane, latlng, [data.x,data.y])
        },
        properties: data
      });
    }
  }).on('end', function(){
    fs.writeFile("graffiti.geojson", JSON.stringify(graffiti));
  });


