const markers = Array.from({ length: 83 }, (_, i) => i);

import React from "react";
import { useState } from "react";
import {FaCaretDown} from "react-icons/fa";
import { useStorage,useMutation } from "@liveblocks/react";
import { RIGHT_MARGIN_DEFAULT,LEFT_MARGIN_DEFAULT } from "@/constants/margins";

export const Ruler = () => {
    const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
    const setLeftMargin = useMutation(({storage},position:number) => {storage.set("leftMargin", position)},[]);

    const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;
    const setRightMargin = useMutation(({storage},position:number) => {storage.set("rightMargin", position)},[]);


    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);

    const rulerRef = React.useRef<HTMLDivElement>(null);

    const handleLeftMouseDown = () => {
        setIsDraggingLeft(true);
    };
    
    const handleRightMouseDown = () => {
        setIsDraggingRight(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const PAGE_WIDTH = 816;
        const MIN_SPACE = 100;
        if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
            const container = rulerRef.current.querySelector("#ruler-container");
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const x = e.clientX - containerRect.left;
                const rawPosition = Math.max(0,Math.min(PAGE_WIDTH,x))
                if (isDraggingLeft) {
                    const maxLeftPosition = PAGE_WIDTH - rightMargin -MIN_SPACE;
                    const newLeftPosition = Math.min(maxLeftPosition, rawPosition);
                    setLeftMargin(newLeftPosition); //todo : Make collaborative
                } else if (isDraggingRight) {
                    const maxRightPosition = PAGE_WIDTH- (leftMargin+ MIN_SPACE);
                    const newRightPosition = Math.max(0, PAGE_WIDTH-rawPosition);
                    const constrainedRightPosition = Math.min(maxRightPosition, newRightPosition);
                    setRightMargin(constrainedRightPosition);
                }
            }
        }
 
      };


      const handleMouseUp = () => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
      };

      const handleLeftDoubleClick = () => {
        setLeftMargin(LEFT_MARGIN_DEFAULT);
      };
    
      const handleRightDoubleClick = () => {
        setRightMargin(RIGHT_MARGIN_DEFAULT);
      };
    
      

  return (
    <div 
        ref={rulerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    className=" w-[816px] mx-auto h-6  border-b border-gray-300 flex  items-end relative select-none print:hidden">
      <div
        id="ruler-container"
        className=" w-full relative h-full"
      >
        <Marker
            position={leftMargin}
            isLeft={true}
            isDragging={isDraggingLeft}
            onMouseDown={handleLeftMouseDown}
            onDoubleCLick={handleLeftDoubleClick}
        />
        <Marker
            position={rightMargin}
            isLeft={false}
            isDragging={isDraggingRight}
            onMouseDown={handleRightMouseDown}
            onDoubleCLick={handleRightDoubleClick}
        />
        <div className="absolute inset-0">
          <div className="relative w-[816px] h-full">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;

              return (
                <div
                  key={marker}
                  className="absolute bottom-0"
                  style={{ left: `${position}px` }}
                >
                  {/* BIG tick */}
                  {marker % 10 === 0 ? (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500">
                        {marker / 10 + 1}
                      </span>
                    </>
                  ) : marker % 5 === 0 ? (
                    /* MEDIUM tick */
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  ) : (
                    /* SMALL tick */
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};



interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleCLick: () => void;
}


const Marker = ( {
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleCLick,
}: MarkerProps) => {
    return(
        <div
            className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
            style={{[isLeft ? "left" : "right"] : `${position}px`}}
            onMouseDown={onMouseDown}
            onDoubleClick={onDoubleCLick}
        >
            <FaCaretDown className="absolute top-0 left-1/2 transform -translate-x-1/2 text fill-blue-500  " />
            <div
                className="absolute left-1/2 top-4 transform -translate-x-1/2 transition-opacity duration-150"
                style={{
                    height :  " 100vh",
                    width: "1px",
                    transform: "scaleX(0.5)",
                    backgroundColor: "#3b72f6",
                    display: isDragging ? "block" : "none",
                    
                }}
            />
        </div>
    );

};