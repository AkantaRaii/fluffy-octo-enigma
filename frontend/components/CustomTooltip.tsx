const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200">
        <p className="text-sm font-medium text-gray-700">{payload[0].name}</p>
        <p className="text-lg font-bold" style={{ color: payload[0].fill }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
