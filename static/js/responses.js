
const getStationList = async ()=> {
    const headers = {};
    const res = await fetch("/api/v1.0/get_station_list", { method: "Get", headers });
    return await res.json();
}

const getSheduleByStation = async (id)=> {
    const headers = {};
    const res = await fetch(`/api/v1.0/get_shedule_by_station/${id}`, { method: "Get", headers });
    const data = await res.json();
    console.log(data);
    return data;
}

//---------------------------------------------------------------