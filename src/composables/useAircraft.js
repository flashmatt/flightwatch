import { computed, reactive, ref } from "vue";

let aircraft = [];
let selectedAircraft = reactive({
    lat: 0,
    lng: 0,
    hex: '',
    type: '',
    flight: '',
    registration: '',
    aircraftType: '',
    altBaro: '',
    altGeom: '',
    gs: 0,
    ias: 0,
    tas: 0,
    mach: 0,
    wd: 0,
    ws: 0,
    oat: 0,
    tat: 0,
    track: 0,
    trackRate: 0,
    roll: 0,
    magHeading: 0,
    trueHeading: 0,
    baroRate: 0,
    geomRate: 0,
    squawk: '',
    emergency: '',
    category: '',
    navQnh: 0,
    navAltitudeMcp: 0,
    navAltitudeFms: 0,
    navModes: '',
    nic: 0,
    rc: 0,
    seenPos: 0,
    version: 0,
    nicBaro: 0,
    nacP: 0,
    nacV: 0,
    sil: 0,
    silType: '',
    gva: 0,
    sda: 0,
    alert: false,
    spi: false,
    mlat: '',
    tisb: '',
    messages: 0,
    seen: 0,
    rssi: 0,
    dst: 0,
    dir: 0,
    rr_lat: 0,
    rr_lon: 0,
    lastPosition: {
        lat: 0,
        lon: 0,
        nic: 0,
        rc: 0,
        seen_pos: 0
    },
    dbFlags: 0,
    acasRa: '',
    gpsOkBefore: 0
});

const aircraftSelected = ref(false);

const useAircraft = () => {

    const setAircraft = (newAircraft) => {
        aircraft = newAircraft;
    }

    const getAircraft = computed(() => {
        return aircraft;
    });

    const updateSelectedAircraft = (newSelectedAircraft) => {

        // Destructure properties from newSelectedAircraft and update selectedAircraft
        Object.assign(selectedAircraft, {
            lat: newSelectedAircraft[0],
            lng: newSelectedAircraft[1],
            hex: newSelectedAircraft[2],
            type: newSelectedAircraft[3],
            flight: newSelectedAircraft[4],
            registration: newSelectedAircraft[5],
            aircraftType: newSelectedAircraft[6],
            altBaro: newSelectedAircraft[7],
            altGeom: newSelectedAircraft[8],
            gs: newSelectedAircraft[9],
            ias: newSelectedAircraft[10],
            tas: newSelectedAircraft[11],
            mach: newSelectedAircraft[12],
            wd: newSelectedAircraft[13],
            ws: newSelectedAircraft[14],
            oat: newSelectedAircraft[15],
            tat: newSelectedAircraft[16],
            track: newSelectedAircraft[17],
            trackRate: newSelectedAircraft[18],
            roll: newSelectedAircraft[19],
            magHeading: newSelectedAircraft[20],
            trueHeading: newSelectedAircraft[21],
            baroRate: newSelectedAircraft[22],
            geomRate: newSelectedAircraft[23],
            squawk: newSelectedAircraft[24],
            emergency: newSelectedAircraft[25],
            category: newSelectedAircraft[26],
            navQnh: newSelectedAircraft[27],
            navAltitudeMcp: newSelectedAircraft[28],
            navAltitudeFms: newSelectedAircraft[29],
            navModes: newSelectedAircraft[30],
            nic: newSelectedAircraft[31],
            rc: newSelectedAircraft[32],
            seenPos: newSelectedAircraft[33],
            version: newSelectedAircraft[34],
            nicBaro: newSelectedAircraft[35],
            nacP: newSelectedAircraft[36],
            nacV: newSelectedAircraft[37],
            sil: newSelectedAircraft[38],
            silType: newSelectedAircraft[39],
            gva: newSelectedAircraft[40],
            sda: newSelectedAircraft[41],
            alert: newSelectedAircraft[42],
            spi: newSelectedAircraft[43],
            mlat: newSelectedAircraft[44],
            tisb: newSelectedAircraft[45],
            messages: newSelectedAircraft[46],
            seen: newSelectedAircraft[47],
            rssi: newSelectedAircraft[48],
            dst: newSelectedAircraft[49],
            dir: newSelectedAircraft[50],
            rr_lat: newSelectedAircraft[51],
            rr_lon: newSelectedAircraft[52],
            lastPosition: {
                lat: newSelectedAircraft[53],
                lon: newSelectedAircraft[54],
                nic: newSelectedAircraft[55],
                rc: newSelectedAircraft[56],
                seen_pos: newSelectedAircraft[57],
            },
            dbFlags: newSelectedAircraft[58],
            acasRa: newSelectedAircraft[59],
            gpsOkBefore: newSelectedAircraft[60]
        });
    }

    const getSelectedAircraft = computed(() => {
        return selectedAircraft;
    });

    const selectAircraft = () => {
        aircraftSelected.value = true;
    }

    const deselectAircraft = () => {
        aircraftSelected.value = false;
    }

    const isAircraftSelected = computed(() => {
        return aircraftSelected.value;
    })

    return {
        setAircraft,
        getAircraft,
        updateSelectedAircraft,
        getSelectedAircraft,
        selectAircraft,
        deselectAircraft,
        isAircraftSelected
    }
}

export default useAircraft;
