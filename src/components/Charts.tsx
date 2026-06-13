"use client";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { Sgpa, Score } from '@/lib/data';

const ACCENT = '#3b82f6';
const CHART_GRID = '#334155';
const AXIS_COLOR = '#94a3b8';
const TOOLTIP_STYLE = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    color: '#f1f5f9',
    fontSize: '13px',
};
const CURSOR_STYLE = { fill: '#334155', opacity: 0.4 };

// Bar colors for GPA chart (muted, desaturated)
const BAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#14B8A6', '#F97316', '#84CC16', '#EF4444'];

export function SgpaChart({ data }: { data: Sgpa[] }) {
    const sorted = [...data].sort((a, b) => Number(a.semester) - Number(b.semester));
    const chartData = sorted.map(d => ({
        name: `S${d.semester}`,
        SGPA: d.sgpa > 0 ? d.sgpa : null,
    })).filter(d => d.SGPA !== null);

    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="name" stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis
                        stroke={AXIS_COLOR}
                        tickLine={false}
                        axisLine={false}
                        domain={['dataMin - 0.5', 10]}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        itemStyle={{ color: ACCENT }}
                        cursor={{ stroke: CHART_GRID, strokeWidth: 2 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="SGPA"
                        stroke={ACCENT}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: ACCENT, strokeWidth: 2, stroke: '#FFFFFF' }}
                        activeDot={{ r: 6, fill: ACCENT, stroke: '#FFFFFF', strokeWidth: 2 }}
                        connectNulls={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function SubjectPerformanceChart({ scores }: { scores: Score[] }) {
    const sortedAll = [...scores].sort((a, b) => Number(a.semester) - Number(b.semester));
    const recentScores = sortedAll.slice(-10);
    const chartData = recentScores
        .filter(s => s.marks !== null && s.marks !== undefined && s.marks !== '')
        .map(s => ({
            name: s.subject_code,
            marks: Number(s.marks),
            grade: s.grade,
        }));

    if (!chartData.length) return null;

    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 48 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke={AXIS_COLOR}
                        tickLine={false}
                        axisLine={false}
                        angle={-40}
                        textAnchor="end"
                        height={60}
                        interval={0}
                        tick={{ fontSize: 11 }}
                    />
                    <YAxis domain={[0, 10]} stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        cursor={CURSOR_STYLE}
                        formatter={(value: unknown, _: unknown, props: { payload?: { grade: string } }) => [
                            `${value} (${props.payload?.grade ?? ''})`,
                            'GPA',
                        ]}
                    />
                    <Bar dataKey="marks" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {chartData.map((_, i) => (
                            <Cell key={`cell-${i}`} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Generic line chart for analytics
export function AnalyticsLineChart({ data, dataKey, xKey, color = ACCENT }: {
    data: Record<string, unknown>[];
    dataKey: string;
    xKey: string;
    color?: string;
}) {
    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey={xKey} stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#FFFFFF' }}
                        activeDot={{ r: 6, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// Horizontal bar chart for department performance
export function DeptBarChart({ data }: {
    data: { name: string; avg: number; max: number }[];
}) {
    return (
        <div style={{ height: `${Math.max(data.length * 36 + 40, 200)}px`, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 0, right: 48, left: 48, bottom: 0 }}
                    barCategoryGap="30%"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={48} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
                    <Bar dataKey="avg" name="Avg CGPA" fill={ACCENT} radius={[0, 4, 4, 0]} maxBarSize={20} />
                    <Bar dataKey="max" name="Highest CGPA" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Histogram bar chart
export function HistogramChart({ data }: {
    data: { range: string; count: number; color: string }[];
}) {
    return (
        <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="range" stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <YAxis stroke={AXIS_COLOR} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={CURSOR_STYLE} />
                    <Bar dataKey="count" name="Students" radius={[4, 4, 0, 0]} maxBarSize={56}>
                        {data.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
