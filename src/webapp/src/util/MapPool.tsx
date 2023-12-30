import {CsMap} from "../codegen/generated-types";

export type CS2Map = {
    map: CsMap
    label: string
    picture: string
}

type MapPool = Record<CsMap, CS2Map>

export const mapPool: MapPool = {
    [CsMap.Mirage]: {
        map: CsMap.Mirage,
        label: "Mirage",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-18.webp"
    },
    [CsMap.Vertigo]: {
        map: CsMap.Vertigo,
        label: "Vertigo",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-19-1024x576.webp"
    },
    [CsMap.Nuke]: {
        map: CsMap.Nuke,
        label: "Nuke",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-20-1024x576.webp"
    },
    [CsMap.Ancient]: {
        map: CsMap.Ancient,
        label: "Ancient",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-21-1024x576.webp"
    },
    [CsMap.Anubis]: {
        map: CsMap.Anubis,
        label: "Anubis",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-27-1024x576.webp"
    },
    [CsMap.Inferno]: {
        map: CsMap.Inferno,
        label: "Inferno",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-22.webp"
    },
    [CsMap.Overpass]: {
        map: CsMap.Overpass,
        label: "Overpass",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-23.webp"
    }
}

export const activeDutyMapPool: CS2Map[] = [
    mapPool[CsMap.Mirage],
    mapPool[CsMap.Ancient],
    mapPool[CsMap.Anubis],
    mapPool[CsMap.Nuke],
    mapPool[CsMap.Overpass],
    mapPool[CsMap.Vertigo],
    mapPool[CsMap.Inferno],
]
