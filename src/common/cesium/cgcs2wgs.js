// convert EPSG4547(CGCS2000/3degree) to convert to EPSG4326(WGS84)
// convert to EPSG4326(WGS84) on website https://epsg.io/4547

import proj4 from 'proj4'

export const cgcs2wgs = (c_xy) => {

    proj4.defs("EPSG:4547","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
    proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
    let lonlat = proj4('EPSG:4547', 'EPSG:4326', c_xy)
    //console.log(lonlat)

    return lonlat
}
export const wgs2cgcs = (lonlat) => {

    proj4.defs("EPSG:4547","+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
    proj4.defs("EPSG:4326","+proj=longlat +datum=WGS84 +no_defs");
    let xy = proj4('EPSG:4326', 'EPSG:4547', lonlat)
    //console.log(xy)

    return xy
}