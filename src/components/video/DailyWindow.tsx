import React, { useEffect, useRef } from "react";

import DailyIframe from "@daily-co/daily-js";
import "./DailyWindow.css";

type Props = {
  videoUrl: string;
};

const DailyWindow: React.FC<Props> = (props: Props) => {
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
          url: props.videoUrl,
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
  }, [createCallFrameAndJoinCall, props.videoUrl]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div className="main_stage_wrapper">
        <div className="dailyStage" ref={containerRef} />
      </div>
      {/* <MainStageInformation event={props.event} /> */}
    </div>
  );
};

export default DailyWindow;
