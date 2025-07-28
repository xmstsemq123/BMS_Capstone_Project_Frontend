import AlertCard from "../AlertCard/AlertCard";

export default function HistoryAlertBlock({ historyData, loadMore, filterType, setFilterType }) {
  // 假設 filterType: "all" / "voltage" / "temperature" / "current"
  const filteredData = historyData.filter((item) => {
    return filterType === "all" || item.dataType === filterType;
  });

  return (
    <div className="w-full">
      {/* 下拉選單 */}
      <div className="mb-4">
        <label className="text-white font-semibold mr-2">篩選類型：</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded px-2 py-1 text-black"
        >
          <option value="all">全部警報</option>
          <option value="voltage">電壓警報</option>
          <option value="temperature">溫度警報</option>
          <option value="current">電流警報</option>
        </select>
      </div>

      {/* 警報清單 */}
      <div className="space-y-3">
        {filteredData.map((item, index) => (
          <AlertCard key={index} item={item} />
        ))}
      </div>

      {/* 載入更多按鈕 */}
      <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
        >
          載入更多
        </button>
      </div>
    </div>
  );
}
