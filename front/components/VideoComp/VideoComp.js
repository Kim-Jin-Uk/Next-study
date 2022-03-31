import React from "react";
import styles from './style.module.scss'
import ReactPlayer from 'react-player/lazy'
import {string} from "prop-types";

const VideoComp = ({src}) => {

    return(
        <>
            <div
                className={styles.video_wrapper}
            >
                <ReactPlayer
                    url={src}
                    playing ={false}
                    controls
                />
            </div>
        </>
    )
}

VideoComp.propTypes = {
    src: string,
}

export default VideoComp
