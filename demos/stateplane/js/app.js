require([
  "esri/map",
  "esri/SpatialReference",
  "esri/layers/FeatureLayer",
  "esri/geometry/Extent",
  "esri/tasks/GeometryService"
], function(Map, SpatialReference, FeatureLayer, Extent, GeometryService) {

  var app = {
    bounds: new Extent({"type":"extent","xmin":-5232649.51283697,"ymin":-2611841.6290115532,"xmax":5005976.007060334,"ymax":2926970.3709884468,"spatialReference":{"wkid":102003}}),
    gs: new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer")
  };

  var select = document.getElementById("wkid");
  select.value = app.bounds.spatialReference.wkid;
  select.addEventListener("change", projectExtent);

  buildMap(app.bounds);

  function buildMap(b) {
    if (app.map) {
      app.map.destroy();
      app.map = null;
    }
    app.bounds = b || app.bounds;
    app.map = new Map("map", {
      extent: app.bounds,
      showAttribution: false,
      sliderStyle: "small",
      smartNavigation: false
    });
    var layer = new FeatureLayer("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_State_Plane_Zones_NAD83/FeatureServer/0", {
    // var layer = new FeatureLayer("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_States_Generalized/FeatureServer/0", {
      styling: false
    });
    app.map.addLayer(layer);
  }

  function projectExtent(val) {
    var wkid = parseInt(select.value);
    if (wkid === app.map.spatialReference.wkid) {
      return;
    }
    var project = app.gs.project([app.map.extent], new SpatialReference(wkid));
    project.then(success, failure);
  }

  function success(result) {
    if (result && result.length) {
      buildMap(result[0]);
    }
  }

  function failure(error) {
    alert("projection failed");
  }
});