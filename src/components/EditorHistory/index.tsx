import { CSSProperties, memo } from "react";
import { HistoryRecordType } from "../../types/historyRecord.type";

interface EditorHistoryProps {
    history: HistoryRecordType[];
    activeIndex: number | undefined;
}

const EditorHistory = (props: EditorHistoryProps) => {
    const { history, activeIndex } = props;

    return (
        <div>
            <span>History</span>
            <div className="history-list">
                {
                    history.map((rec, i) => {
                        const style: CSSProperties = {
                            fontWeight: rec.bold && "bold" || undefined,
                            fontStyle: rec.italic && "italic" || undefined,
                            borderColor: i === activeIndex && "#0078d7" || "transparent",
                        }
                        return <div key={i} className="history-list-element" style={style}>
                            {rec.text}
                        </div>
                    })
                }
            </div>
        </div>
    );
};

export default memo(EditorHistory);