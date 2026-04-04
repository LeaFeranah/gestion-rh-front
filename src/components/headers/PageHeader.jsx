import React from "react";

const KpiCard = ({ label, value, sub, dotColor }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative">
    {dotColor && (
      <span
        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
        style={{ background: dotColor }}
      />
    )}
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {label}
    </p>
    <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const PageHeader = ({ pageTag, title, subtitle, kpis = [], kpiCols = 4 }) => {
  const colsMap = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
  };

  return (
    <div className="mb-8">
      {pageTag && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {pageTag}
        </p>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

      {kpis.length > 0 && (
        <div className={`grid gap-6 ${colsMap[kpiCols] ?? "grid-cols-4"}`}>
          {kpis.map((kpi, i) => (
            <KpiCard key={i} {...kpi} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageHeader;