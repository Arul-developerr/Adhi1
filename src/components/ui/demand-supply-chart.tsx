"use client";

import * as React from "react";
import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    AXIS_PROPS,
    CHART_COLORS,
    ChartTooltip,
    GRID_PROPS,
} from "./chart";

export interface DemandSupplyPoint {
    month: string
    demand: number
    supply: number
}

/**
 * Demand against supply.
 *
 * Supply is drawn as a filled area and demand as a line above it, so the
 * shortfall between the two reads as an uncovered band rather than as two
 * overlapping translucent fills.
 */
export function DemandSupplyChart({
    data,
    height = "100%",
    xKey = "month",
}: {
    data: DemandSupplyPoint[]
    /** Pass "100%" to fill the parent container's height. */
    height?: number | string
    xKey?: string
}) {
    const totals = React.useMemo(
        () =>
            data.reduce(
                (acc, point) => ({
                    demand: acc.demand + point.demand,
                    supply: acc.supply + point.supply,
                }),
                { demand: 0, supply: 0 }
            ),
        [data]
    );

    const gap = totals.supply - totals.demand;

    return (
        <>
            <ResponsiveContainer width="100%" height={height}>
                <ComposedChart
                    data={data}
                    margin={{ top: 8, right: 8, bottom: 0, left: -14 }}
                >
                    <CartesianGrid {...GRID_PROPS} />
                    <XAxis dataKey={xKey} {...AXIS_PROPS} />
                    <YAxis {...AXIS_PROPS} width={52} />
                    <Tooltip content={<ChartTooltip unit="units" />} />
                    <Area
                        type="monotone"
                        dataKey="supply"
                        name="Supply"
                        stroke={CHART_COLORS.forest}
                        strokeWidth={1.5}
                        fill={CHART_COLORS.forest}
                        fillOpacity={0.14}
                        dot={false}
                        activeDot={{ r: 3.5, strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="demand"
                        name="Demand"
                        stroke={CHART_COLORS.danger}
                        strokeWidth={2.25}
                        dot={false}
                        activeDot={{ r: 3.5, strokeWidth: 2 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
            <p className="sr-only">
                Demand against supply across {data.length} periods. Total demand{" "}
                {totals.demand.toLocaleString()} units against total supply{" "}
                {totals.supply.toLocaleString()} units, a{" "}
                {gap >= 0 ? "surplus" : "shortfall"} of{" "}
                {Math.abs(gap).toLocaleString()} units.
            </p>
        </>
    );
}
