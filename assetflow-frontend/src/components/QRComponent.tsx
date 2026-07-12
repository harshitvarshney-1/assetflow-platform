import React from 'react';

interface QRComponentProps {
  value: string;
  size?: number;
}

export const QRComponent: React.FC<QRComponentProps> = ({ value, size = 120 }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-200 shadow-md text-slate-800">
      <svg
        width={size}
        height={size}
        viewBox="0 0 29 29"
        shapeRendering="crispEdges"
        className="text-slate-900 fill-current"
      >
        <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm5-2h2v1H7zm3 0h1v1h-1zm1 0h3v1h-3zm4 0h1v1h-1zm1 0h1v1h-1zm2 0h3v1h-3zm4 0h1v3h-1zm-9 1v1h-1v-1zm2 0h1v1h-1zm3 0h2v1h-2zm2 0h1v1h-1zm2 0h1v1h-1zm-13 1h2v1H7zm1 0v1h1v-1zm4 0h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm1 0h1v1h-1zm1 0h1v1h-1zm-19 1h1v2h-1zm3 0h1v1H3zm2 0h1v1H5zm3 0h1v1H8zm1 0h2v1h-2zm3 0h2v1h-2zm3 0h1v1h-1zm1 0h2v1h-2zm3 0h1v2h-1zm-16 1h1v1H1zm2 0h1v1H3zm3 0h1v1H6zm4 0h1v1h-1zm2 0h3v1h-3zm5 0h1v1h-1zm2 0h1v1h-1zm-15 1h7v7H0zm1 1v5h5V7zm1 1h3v3H2zm12-7h2v1h-2zm1 0h1v1h-1zm2 0h1v2h-1zm3 0h1v1h-1zm2 0h1v1h-1zm-9 1h1v1h-1zm2 0h2v1h-2zm4 0h1v1h-1zm3 0h1v1h-1zm-13 1h2v1h-2zm3 0h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h3v1h-3zm-13 1h1v2h-1zm2 0h2v1h-2zm3 0h1v1h-1zm2 0h1v1h-1zm3 0h1v1h-1zm1 0h1v1h-1zm2 0h1v1h-1zm-16 1h2v1h-2zm3 0h1v1H3zm4 0h1v1H7zm2 0h1v1H9zm2 0h2v1h-2zm4 0h1v1h-1zm2 0h2v1h-2zm-12 1h1v1h-1zm3 0h1v1h-1zm2 0h1v1h-1zm2 0h2v1h-2zm5 0h1v1h-1zm-13 1h1v1H1zm3 0h1v1H4zm1 0h1v1H5zm3 0h1v1H8zm3 0h1v1h-1zm2 0h3v1h-3zm4 0h1v1h-1zm1 0h2v1h-2zm2 0h1v1h-1z" />
      </svg>
      <div className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider select-all">
        {value}
      </div>
    </div>
  );
};
