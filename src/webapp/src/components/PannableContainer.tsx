import {IconButton, Theme} from "@mui/material";
import React, {CSSProperties, useCallback, useState} from "react";
import {throttle} from "lodash";
import {Replay, ZoomIn, ZoomOut} from "@mui/icons-material";
import {makeStyles} from "@mui/styles";

interface StylesProps {
    position: DragPosition,
    zoom: number
}

const useStyles = makeStyles<Theme, StylesProps>(theme => ({
    pannable: props => ({
        display: "flex",
        position: "relative",
        overflow: "hidden",
        height: "100vh",
        "& > div:first-child": {
            scale: props.zoom,
            transitionDuration: "200ms",
            transitionTimingFunction: "ease-out",
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

interface PannableContainerProps {
    style?: CSSProperties
}

export const PannableContainer = (props: React.PropsWithChildren<PannableContainerProps>): JSX.Element => {
    const [isDragging, setIsDragging] = useState(false)
    const [elementPosition, setElementPosition] = useState<DragPosition>({x: 0, y: 0})
    const [prevMousePosition, setPrevMousePosition] = useState<DragPosition>({x: 0, y: 0})
    const [zoom, setZoom] = useState<number>(1)
    const classes = useStyles({position: elementPosition, zoom})
    const ZOOM_FACTOR = 1.05


    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) {
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
        const newZoom = zoom * ZOOM_FACTOR
        if (newZoom < 2) {
            setZoom(newZoom)
        }
    }

    const handleDecreaseZoom = () => {
        const newZoom = zoom / ZOOM_FACTOR
        if (newZoom > 0.5) {
            setZoom(newZoom)
        }
    }

    const handleReset = () => {
        setZoom(1)
        setElementPosition({x: 0, y: 0})
    }

    return <div className={classes.pannable}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMoveThrottled}
                onMouseLeave={handleMouseUp}
                style={props.style}
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