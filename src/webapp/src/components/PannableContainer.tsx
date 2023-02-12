import {IconButton, makeStyles, Theme} from "@material-ui/core";
import React, {useCallback, useState} from "react";
import {throttle} from "lodash";
import {Replay, ZoomIn, ZoomOut} from "@material-ui/icons";

interface StylesProps {
    position: DragPosition,
    zoom: number
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    pannable: props => ({
        position: "absolute",
        overflow: "hidden",
        width: "1200px",
        height: "700px",
        "& > div:first-child": {
            scale: props.zoom,
            transform: `translate(${props.position.x}px, ${props.position.y}px) scale(${props.zoom})`
        }
    }),
    zoomContainer: {
        position: "absolute",
        transform: "translate(-100%, 0%)",
        left: "100%",
    }
}))

interface DragPosition {
    x: number,
    y: number
}

export const PannableContainer = (props: React.PropsWithChildren<any>): JSX.Element => {
    const [isDragging, setIsDragging] = useState(false)
    const [elementPosition, setElementPosition] = useState<DragPosition>({x: 0, y: 0})
    const [prevMousePosition, setPrevMousePosition] = useState<DragPosition>({x: 0, y: 0})
    const [zoom, setZoom] = useState<number>(1)
    const classes = useStyles({position: elementPosition, zoom})
    const ZOOM_FACTOR = 1.05


    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1) { // middle click
            setIsDragging(true)
        }
        setPrevMousePosition({x: e.pageX, y: e.pageY})
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isDragging) {
            const deltaX = e.pageX - prevMousePosition.x
            const deltaY = e.pageY - prevMousePosition.y
            setElementPosition({x: elementPosition.x + deltaX, y: elementPosition.y + deltaY})
        }
        setPrevMousePosition({x: e.pageX, y: e.pageY})
    }, [isDragging])

    const handleMouseMoveThrottled = useCallback(throttle((e: React.MouseEvent) => {
        handleMouseMove(e)
    }, 20), [isDragging])

    const handleIncreaseZoom = () => {
        setZoom(zoom * ZOOM_FACTOR)
    }

    const handleDecreaseZoom = () => {
        setZoom(zoom / ZOOM_FACTOR)
    }

    const handleReset = () => {
        setZoom(1)
        setElementPosition({x: 0, y: 0})
    }

    const handleScroll = (e: React.WheelEvent) => {
        e.deltaY > 0 ? handleDecreaseZoom() : handleIncreaseZoom()
    }


    return <div className={classes.pannable}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMoveThrottled}
                onMouseLeave={handleMouseUp}
                onWheel={handleScroll}
    >
        {props.children}
        <div className={classes.zoomContainer}>
            <IconButton onClick={handleIncreaseZoom}>
                <ZoomIn/>
            </IconButton>
            <IconButton onClick={handleDecreaseZoom}>
                <ZoomOut/>
            </IconButton>
            <IconButton onClick={handleReset}>
                <Replay/>
            </IconButton>
        </div>
    </div>
}