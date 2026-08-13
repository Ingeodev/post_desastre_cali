import {
  geometryToGeoJsonPoint,
  geoJsonPointToWkb,
  wkbToGeoJsonPoint,
} from './geom.mapper';
import { GeoJsonPoint } from '../../data/entities/inspection.entity';

describe('geometryToGeoJsonPoint', () => {
  it('should pass through a GeoJSON point', () => {
    const geom: GeoJsonPoint = { type: 'Point', coordinates: [-76.5225, 3.4516] };

    expect(geometryToGeoJsonPoint(geom)).toEqual({
      type: 'Point',
      coordinates: [-76.5225, 3.4516],
    });
  });

  it('should return null for null or undefined input', () => {
    expect(geometryToGeoJsonPoint(null)).toBeNull();
    expect(geometryToGeoJsonPoint(undefined)).toBeNull();
  });

  it('should coerce coordinates to numbers when they come as strings', () => {
    const point: GeoJsonPoint = { type: 'Point', coordinates: [-76.5225, 3.4516] };
    expect(geometryToGeoJsonPoint(point)).toEqual({
      type: 'Point',
      coordinates: [-76.5225, 3.4516],
    });
  });

  it('should return null for a non-point geometry', () => {
    const geom = {} as unknown as { type: 'Polygon'; coordinates: number[][] };

    expect(geometryToGeoJsonPoint(geom as never)).toBeNull();
  });

  it('should round-trip an EWKB hex string through toGeoJson', () => {
    const point: GeoJsonPoint = { type: 'Point', coordinates: [-76.5225, 3.4516] };
    const wkb = geoJsonPointToWkb(point);

    const roundTripped = wkbToGeoJsonPoint(wkb);

    expect(geometryToGeoJsonPoint(wkb)).toEqual(roundTripped);
    expect(geometryToGeoJsonPoint(wkb)!.coordinates[0]).toBeCloseTo(-76.5225);
    expect(geometryToGeoJsonPoint(wkb)!.coordinates[1]).toBeCloseTo(3.4516);
  });
});