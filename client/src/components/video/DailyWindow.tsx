import React, { useEffect, useRef } from "react";

import DailyIframe from "@daily-co/daily-js";
import "./DailyWindow.css"
// interface EventInformation {
//   id: string;
//   url: string;
//   title: string;
//   tags: string[];
//   description: string;
// }

type Props = {
  videoID: string;
  // event: EventInformation;
};

const DailyWindow: React.FC<Props> = (props: Props) => {
  const url = props.videoID.split("?t=")[0];
  const token = props.videoID.split("?t=")[1] || "";

  const containerRef = useRef<HTMLDivElement>(null);

  async function createCallFrameAndJoinCall() {
    if (containerRef.current !== null) {
      const divElement = containerRef.current;
      if (divElement !== null) {
        const callFrame = DailyIframe.createFrame(divElement, {
          showLeaveButton: true,
          showFullscreenButton: true,
          theme: {
            colors: {
              accent: "#286DA8",
              accentText: "#FFFFFF",
              background: "#FFFFFF",
              backgroundAccent: "#FBFCFD",
              baseText: "#000000",
              border: "#EBEFF4",
              mainAreaBg: "#000000",
              mainAreaBgAccent: "#333333",
              mainAreaText: "#FFFFFF",
              supportiveText: "#808080",
            },
          },
        });
        await callFrame.join({
          url,
          token,
        });
        callFrame.on("left-meeting", _ => {
          if (containerRef != null) {
            if (containerRef.current != null) {
              containerRef.current.innerHTML = "";
            }
          }
          createCallFrameAndJoinCall();
        });
      }
    }
  }

  useEffect(() => {
    if (containerRef != null) {
      if (containerRef.current != null) {
        containerRef.current.innerHTML = "";
      }
    }
    createCallFrameAndJoinCall();
  }, [createCallFrameAndJoinCall, props.videoID]);

  return (
    <div>
      <div className="main_stage_wrapper">
        <div className="dailyStage" ref={containerRef} />
      </div>
      {/* <MainStageInformation event={props.event} /> */}
    </div>
  );
};

export default DailyWindow;