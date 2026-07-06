"use client";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const COLORS = ['#3b82f6', '#0ea5e9', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f43f5e'];

export function DepartmentComparisonChart({ data }: { data: any[] }) {
    const sortedData = [...data].sort((a, b) => b.AverageCGPA - a.AverageCGPA);
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" domain={[0, 10]} stroke="#94a3b8" />
                    <YAxis dataKey="Name" type="category" stroke="#94a3b8" width={60} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />
                    <Bar dataKey="highestCGPA" name="Highest" fill="#10b981" radius={[0, 4, 4, 0]} barSize={8} />
                    <Bar dataKey="AverageCGPA" name="Average" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={8} />
                    <Bar dataKey="lowestCGPA" name="Lowest" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={8} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BranchSizeChart({ data }: { data: any[] }) {
    const chartData = data.map(d => ({ name: d.Name, value: d.branchSize })).sort((a, b) => b.value - a.value).slice(0, 15); // limit to top 15 for pie clarity
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#fff' }} formatter={(value: any, name: any) => [`${value} Students`, name]} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export function CgpaDistributionChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="range" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                    <Bar dataKey="count" name="Students" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function GradeDistributionChart({ data }: { data: Record<string, number> }) {
    const chartData = Object.entries(data).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                    <Bar dataKey="value" name="Count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function YearlyTrendChart({ data }: { data: any[] }) {
    const formattedData = [...data].sort((a, b) => Number(a.year) - Number(b.year));
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="averageCGPA" name="Average CGPA" stroke="#10b981" fillOpacity={1} fill="url(#colorCgpa)" strokeWidth={3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export function SemesterTrendChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="semester" stroke="#94a3b8" />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="averageSGPA" name="Average SGPA" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function MarksHistogramChart({ data }: { data: { range: string; count: number }[] }) {
    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                    <Bar dataKey="count" name="Students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BranchAvgMarksChart({ data }: { data: { branch_code: string; avg_marks: number; total_students: number }[] }) {
    const sorted = [...data].sort((a, b) => b.avg_marks - a.avg_marks);
    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={sorted} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="branch_code" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={[0, 10]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                    <Bar dataKey="avg_marks" name="Avg GPA" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function SubjectYearTrendChart({ data }: { data: { year_of_study: string; avg_marks: number }[] }) {
    const sorted = [...data].sort((a, b) => a.year_of_study.localeCompare(b.year_of_study));
    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={sorted} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="year_of_study" stroke="#94a3b8" fontSize={12} />
                    <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="avg_marks" name="Avg GPA" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function TopPerformersByBranchChart({ data }: { data: { branch: string; count: number }[] }) {
    const sorted = [...data].sort((a, b) => b.count - a.count);
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={sorted} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="branch" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" allowDecimals={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                    <Bar dataKey="count" name="Top Performers" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {sorted.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index < 3 ? '#10b981' : '#0ea5e9'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
