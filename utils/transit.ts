import Papa from "papaparse";

// returns a GeoJSON LineString FeatureCollection from a GTFS shapes.txt file of transit routes
// where headers should be
// fields: [ 'shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence' ]

interface Point {
  shape_id: number;
  shape_pt_lat: number;
  shape_pt_lon: number;
  shape_pt_sequence: number;
}

export const getRoutesFromShapes = (csv: string) => {
  const lastChar = csv[csv.length - 1];
  let str = csv;
  if (lastChar === "\n") {
    str = csv.slice(0, csv.length - 1);
  }
  const results = Papa.parse(str, {
    header: true,
    dynamicTyping: true,
  });
  const data = results.data as Point[];
  const ids = new Set();
  const routeMap = new Map();
  data.forEach((point) => ids.add(point.shape_id));
  Array.from(ids).forEach((id) =>
    routeMap.set(id, {
      type: "Feature",
      properties: {
        id: id,
      },
      geometry: {
        type: "LineString",
        coordinates: [],
      },
    })
  );
  const routes = Object.fromEntries(routeMap);
  data.forEach((point) => {
    routes[point.shape_id]["geometry"]["coordinates"].push([
      point.shape_pt_lon,
      point.shape_pt_lat,
    ]);
  });
  const features = Object.values(routes);
  const geojson = {
    type: "FeatureCollection",
    features: features,
  };
  return geojson;
};

// returns a GeoJSON Point FeatureCollection from a GTFS stops.txt file of transit stops
// where headers should be
/*
  fields: [
    'stop_id',
    'stop_code',
    'stop_name',
    'stop_lat',
    'stop_lon',
    'stop_url',
    'location_type',
    'parent_station',
    'wheelchair_boarding'
  ]
*/

interface Stop {
  stop_id: string | number;
  stop_code: number;
  stop_name: string;
  stop_lat: number;
  stop_lon: number;
  stop_url: string | null;
  location_type: number;
  parent_station: string | null;
  wheelchair_boarding: number;
}

function getPointsFromStops(csv: string) {
  const lastChar = csv[csv.length - 1];
  let str = csv;
  if (lastChar === "\n") {
    str = csv.slice(0, csv.length - 1);
  }
  const results = Papa.parse(str, {
    header: true,
    dynamicTyping: true,
  });
  const data = results.data as Stop[];
  const features = data.map((stop) => ({
    type: "Feature",
    properties: {
      id: stop.stop_id,
      code: stop.stop_code,
      name: stop.stop_name,
      url: stop.stop_url,
      locationType: stop.location_type,
      parentStation: stop.parent_station,
      wheelchairBoarding: stop.wheelchair_boarding,
    },
    geometry: {
      type: "Point",
      coordinates: [stop.stop_lon, stop.stop_lat],
    },
  }));
  const geojson = {
    type: "FeatureCollection",
    features: features,
  };
  return geojson;
}
