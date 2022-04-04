import React, {useState} from "react";
import styles from './style.module.scss'
import ReactPlayer from 'react-player/lazy'
import {string} from "prop-types";

const VideoComp = () => {
    const [playIndex, setPlayIndex] = useState(0);
    const playList = [
        {index:1, url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'},
        {index:2, url: 'http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8'},
        {index:3, url: 'http://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8'}
    ];
    const handleNextVideo = (video, playIndex) => {
        if(playIndex === video.length - 1){
            setPlayIndex(0);
        }else{
            setPlayIndex(playIndex + 1);
        }
    }

    return(
        <>
            <div
                className={styles.video_wrapper}
            >
                <ReactPlayer
                    url={playList[playIndex].url}   // 플레이어 url
                    width='800px'           // 플레이어 크기 (가로)
                    height='500px'          // 플레이어 크기 (세로)
                    playing={true}          // 자동 재생 on
                    muted={true}            // 자동 재생 on
                    controls={true}         // 플레이어 컨트롤 노출 여부
                    light={false}           // 플레이어 모드
                    pip={true}              // pip 모드 설정 여부
                    poster={'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'}   // 플레이어 초기 포스터 사진
                    onEnded={() => handleNextVideo(playList, playIndex)}  // 플레이어 끝났을 때 이벤트
                />
            </div>
        </>
    )
}

VideoComp.propTypes = {
    src: string,
}

export default VideoComp
