import { useGeminiImport } from "../../hooks/useGeminiImport";
import { useSchedule } from "../../hooks/useSchedule";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { DAY_NAMES } from "../../constants/schedule";

export function PdfImport() {
  const { filePath, extractedSchedule, isLoading, error, selectFile, extractSchedule, reset } =
    useGeminiImport();
  const { saveSchedule } = useSchedule();

  const handleConfirm = async () => {
    if (extractedSchedule === null) return;
    await saveSchedule(extractedSchedule);
    reset();
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-2 text-sm font-medium text-gray-500">PDF からスケジュールを読み込み</h3>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              void selectFile();
            }}
            className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            PDF を選択
          </button>
          {filePath !== null && <span className="truncate text-sm text-gray-600">{filePath}</span>}
        </div>

        {filePath !== null && extractedSchedule === null && !isLoading && (
          <button
            type="button"
            onClick={() => {
              void extractSchedule();
            }}
            className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
          >
            解析
          </button>
        )}

        {isLoading && <LoadingSpinner />}

        {error !== null && <p className="text-sm text-red-500">{error}</p>}

        {extractedSchedule !== null && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">抽出結果のプレビュー</h4>
            <table className="w-full text-sm">
              <tbody>
                {DAY_NAMES.map((dayName, index) => {
                  const day = extractedSchedule[String(index)];
                  return (
                    <tr key={dayName} className="border-b">
                      <td className="py-1 pr-2 font-medium">{dayName}</td>
                      <td className="py-1">
                        {day !== undefined && day.name !== "" ? day.name : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  void handleConfirm();
                }}
                className="rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                保存
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
