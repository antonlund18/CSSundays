export type CS2Map = {
    label: string
    picture: string
}

enum MapType {
    MIRAGE,
    VERTIGO,
    NUKE,
    ANCIENT,
    ANUBIS,
    INFERNO,
    OVERPASS,
    DUST2,
    TRAIN,
    COBBLESTONE,
}

type MapPool = Record<MapType, CS2Map>

export const mapPool: MapPool = {
    [MapType.MIRAGE]: {
        label: "Mirage",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-18.webp"
    },
    [MapType.VERTIGO]: {
        label: "Vertigo",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-19-1024x576.webp"
    },
    [MapType.NUKE]: {
        label: "Nuke",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-20-1024x576.webp"
    },
    [MapType.ANCIENT]: {
        label: "Ancient",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-21-1024x576.webp"
    },
    [MapType.ANUBIS]: {
        label: "Anubis",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-27-1024x576.webp"
    },
    [MapType.INFERNO]: {
        label: "Inferno",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-22.webp"
    },
    [MapType.OVERPASS]: {
        label: "Overpass",
        picture: "https://tradeit.gg/blog/wp-content/uploads/2023/07/image-23.webp"
    },
    [MapType.DUST2]: {
        label: "",
        picture: ""
    },
    [MapType.TRAIN]: {
        label: "",
        picture: ""
    },
    [MapType.COBBLESTONE]: {
        label: "",
        picture: ""
    }
}

export const activeDutyMapPool: CS2Map[] = [
    mapPool[MapType.MIRAGE],
    mapPool[MapType.ANCIENT],
    mapPool[MapType.ANUBIS],
    mapPool[MapType.NUKE],
    mapPool[MapType.OVERPASS],
    mapPool[MapType.VERTIGO],
    mapPool[MapType.INFERNO],
]


