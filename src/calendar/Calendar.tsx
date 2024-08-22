import React, { memo, useCallback, useRef } from "react";
import { IStaff } from "../lib/type";
import { convertMinutuesToHourMinutes, generateSlot } from "../utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { DrawBookingServices } from "./DrawBookingServices";

type CalendarProps = {
  staff: IStaff[];
  slotInterval: number;
  columnCount: number;
  indexWidth?: number;
  columnWidth?: number;
  rowHeight?: number;
  headerHeight?: number;
};

const MemoziedCalendar = ({
  staff,
  slotInterval,
  rowHeight = 36,
  indexWidth = 80,
  columnWidth = 200,
  headerHeight = 100,
}: CalendarProps) => {
  const slots = generateSlot(360, 24 * 60, slotInterval);
  const rowCount = slots.length;
  const columnCount = staff.length;

  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => rowHeight, [rowHeight]),
    overscan: 5,
    paddingStart: headerHeight,
  });

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columnCount,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => columnWidth, [columnWidth]),
    overscan: 5,
    paddingStart: indexWidth,
  });

  return (
    <div ref={parentRef} className="w-full h-full overflow-auto relative">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: `${columnVirtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            zIndex: 3,
            top: 0,
            height: headerHeight,
            width: `100%`,
          }}
        >
          <div
            style={{
              position: "sticky",
              width: indexWidth,
              top: 0,
              left: 0,
              background: "#000",
              zIndex: 2,
              height: headerHeight,
            }}
          />
          {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
            <>
              <div
                className="ListItem"
                key={virtualColumn.index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: virtualColumn.size,
                  height: headerHeight,
                  transform: `translateX(${virtualColumn.start}px)`,
                  background: "#fff",
                }}
              >
                {`IStaff ${virtualColumn.index}`}
              </div>
            </>
          ))}
        </div>
        <div
          style={{
            position: "sticky",
            zIndex: 2,
            left: 0,
            width: indexWidth,
            height: `calc(100% - ${headerHeight}px)`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <>
              <div
                key={virtualRow.index}
                className="flex items-center justify-center text-sm"
                style={{
                  position: "absolute",
                  left: 0,
                  width: indexWidth,
                  height: virtualRow.size,
                  transform: `translateX(0px) translateY(${
                    virtualRow.start - headerHeight
                  }px)`,
                  background: "#fff",
                }}
              >
                {convertMinutuesToHourMinutes(slots[virtualRow.index], true)}
              </div>
            </>
          ))}
        </div>
        {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
          const staffDetail = staff[virtualColumn.index];

          return (
            <div
              key={virtualColumn.index}
              style={{
                position: "absolute",
                top: headerHeight,
                left: 0,
                width: `${virtualColumn.size}px`,
                height: 0,
                zIndex: 1,
                transform: `translateX(${
                  virtualColumn.start
                }px) translateY(${0}px)`,
              }}
            >
              <DrawBookingServices
                staffDetail={staffDetail}
                slotInterval={slotInterval}
                rowHeight={rowHeight}
              />
            </div>
          );
        })}
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <React.Fragment key={virtualRow.key}>
            {columnVirtualizer.getVirtualItems().map((virtualColumn) => (
              <div
                key={virtualColumn.key}
                className={
                  virtualColumn.index % 2
                    ? virtualRow.index % 2 === 0
                      ? "ListItemOdd"
                      : "ListItemEven"
                    : virtualRow.index % 2
                    ? "ListItemOdd"
                    : "ListItemEven"
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${virtualColumn.size}px`,
                  height: `${virtualRow.size}px`,
                  transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                }}
              >
                Cell {virtualRow.index}, {virtualColumn.index}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const Calendar = memo(MemoziedCalendar);
