import { InspectionEntity, GeoJsonPoint } from '../../data/entities/inspection.entity';

const POINT_TYPE = 1;
const EWKB_SRID_FLAG = 0x20000000;
const SRID_4326 = 4326;

export function geoJsonPointToWkb(point: GeoJsonPoint | null): string | null {
  if (!point) {
    return null;
  }

  const [x, y] = point.coordinates;

  const buffer = new ArrayBuffer(1 + 4 + 4 + 16);
  const view = new DataView(buffer);

  view.setUint8(0, 0x01); // little endian
  view.setUint32(1, POINT_TYPE | EWKB_SRID_FLAG, true);
  view.setUint32(5, SRID_4326, true);
  view.setFloat64(9, x, true);
  view.setFloat64(17, y, true);

  return Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export function wkbToGeoJsonPoint(wkb: string | null): GeoJsonPoint | null {
  if (!wkb || wkb.length < 25) {
    return null;
  }

  const bytes = Uint8Array.from(
    wkb.match(/.{1,2}/g)?.map((hex) => parseInt(hex, 16)) ?? [],
  );
  const view = new DataView(bytes.buffer);

  const littleEndian = bytes[0] === 0x01;
  const type = view.getUint32(1, littleEndian);

  if ((type & 0xff) !== POINT_TYPE) {
    return null; // only Point supported
  }

  const hasSrid = (type & EWKB_SRID_FLAG) !== 0;
  const offset = hasSrid ? 9 : 5;

  const x = view.getFloat64(offset, littleEndian);
  const y = view.getFloat64(offset + 8, littleEndian);

  return { type: 'Point', coordinates: [x, y] };
}

export function toInspectionEntity(input: {
  id: string;
  deviceLocalId: string;
  capturedAt: string;
  geom: string | null;
  damageCategoryId: number;
  dataSourceId: number;
  seismicEventId: string;
  constructionTypeId: number | null;
  deviceId: string | null;
  addressText: string | null;
  approxYearBuilt: number | null;
  notes: string | null;
  numFloors: number | null;
  reportedBy: string | null;
  createdAt: string | null;
  syncedAt: string | null;
}): InspectionEntity {
  return {
    ...input,
    geom: wkbToGeoJsonPoint(input.geom),
  };
}

export function toRemoteInput(
  inspection: InspectionEntity,
): Omit<InspectionEntity, 'geom'> & { geom: string | null } {
  return {
    ...inspection,
    geom: geoJsonPointToWkb(inspection.geom),
  };
}