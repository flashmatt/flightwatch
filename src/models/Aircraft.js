import { fromLonLat } from "ol/proj";

export default class Aircraft {
  constructor(aircraft) {
    this.lat = aircraft.lat ?? 0;
    this.lon = aircraft.lon ?? 0;
    this.hex = aircraft.hex ?? "";
    this.flight = aircraft.flight ?? "Unknown";
    this.track = aircraft.track ?? 0;
    this.speed = aircraft.gs ?? 0;

    this.type = aircraft.type ?? "Unknown Type";
    this.registration = aircraft.r ?? "Unknown Registration";
    this.aircraftType = aircraft.t ?? "Unknown Aircraft";

    this.altBaro = aircraft.alt_baro ?? null;
    this.altGeom = aircraft.alt_geom ?? null;

    this.gs = aircraft.gs ?? 0;
    this.ias = aircraft.ias ?? 0;
    this.tas = aircraft.tas ?? 0;
    this.mach = aircraft.mach ?? 0;

    this.wd = aircraft.wd ?? 0;
    this.ws = aircraft.ws ?? 0;
    this.oat = aircraft.oat ?? 0;
    this.tat = aircraft.tat ?? 0;

    this.trackRate = aircraft.track_rate ?? 0;
    this.roll = aircraft.roll ?? 0;
    this.magHeading = aircraft.mag_heading ?? 0;
    this.trueHeading = aircraft.true_heading ?? 0;

    this.baroRate = aircraft.baro_rate ?? 0;
    this.geomRate = aircraft.geom_rate ?? 0;

    this.squawk = aircraft.squawk ?? "0000";
    this.emergency = aircraft.emergency ?? "None";
    this.category = aircraft.category ?? "Unknown";

    this.navQnh = aircraft.nav_qnh ?? 0;
    this.navAltitudeMcp = aircraft.nav_altitude_mcp ?? 0;
    this.navAltitudeFms = aircraft.nav_altitude_fms ?? 0;
    this.navModes = aircraft.nav_modes ?? [];

    this.nic = aircraft.nic ?? 0;
    this.rc = aircraft.rc ?? 0;
    this.nicBaro = aircraft.nic_baro ?? 0;
    this.nacP = aircraft.nac_p ?? 0;
    this.nacV = aircraft.nac_v ?? 0;

    this.sil = aircraft.sil ?? 0;
    this.silType = aircraft.sil_type ?? "Unknown";

    this.gva = aircraft.gva ?? 0;
    this.sda = aircraft.sda ?? 0;

    this.alert = aircraft.alert ?? false;
    this.spi = aircraft.spi ?? false;

    this.mlat = aircraft.mlat ?? "N/A";
    this.tisb = aircraft.tisb ?? "N/A";

    this.messages = aircraft.messages ?? 0;
    this.seen = aircraft.seen ?? 0;
    this.rssi = aircraft.rssi ?? 0;

    this.dst = aircraft.dst ?? 0;
    this.dir = aircraft.dir ?? 0;
    this.rr_lat = aircraft.rr_lat ?? 0;
    this.rr_lon = aircraft.rr_lon ?? 0;

    this.lastPosition = aircraft.lastPosition
      ? {
          lat: aircraft.lastPosition.lat ?? 0,
          lon: aircraft.lastPosition.lon ?? 0,
          nic: aircraft.lastPosition.nic ?? 0,
          rc: aircraft.lastPosition.rc ?? 0,
          seen_pos: aircraft.lastPosition.seen_pos ?? 0,
        }
      : {
          lat: 0,
          lon: 0,
          nic: 0,
          rc: 0,
          seen_pos: 0,
        };

    this.dbFlags = aircraft.dbFlags
      ? {
          military: (aircraft.dbFlags & 1) !== 0,
          interesting: (aircraft.dbFlags & 2) !== 0,
          PIA: (aircraft.dbFlags & 4) !== 0,
          LADD: (aircraft.dbFlags & 8) !== 0,
        }
      : {
          military: false,
          interesting: false,
          PIA: false,
          LADD: false,
        };

    this.acasRa = aircraft.acas_ra ?? "None";
    this.gpsOkBefore = aircraft.gpsOkBefore ?? 0;

    this.airline_code = '';
    this.route = [];
  }

  getPosition() {
    return { lat: this.lat, lon: this.lon };
  }

  getFeaturePosition() {
    return fromLonLat([this.lon, this.lat]);
  }

  getRotation() {
    return (this.trueHeading * Math.PI) / 180;
  }

  getAltitude() {
    if (this.altGeom !== null && this.altGeom !== undefined) {
      return this.altGeom;
    }
    return this.altBaro;
  }

}
