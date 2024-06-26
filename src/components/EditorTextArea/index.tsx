import { CSSProperties, ChangeEventHandler, memo, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { TEXT_EDITOR_HISTORY_TIMEOUT } from "../../constants";
import { historyPush, setText, textSelector } from "../../redux/slices/editor.slice";

interface EditorTextAreaProps {
    bold: boolean;
    italic: boolean;
}

const EditorTextArea = (props: EditorTextAreaProps) => {
    const { bold, italic } = props;
    
	const text = useAppSelector(textSelector);
	const dispatch = useAppDispatch();
    
	const [timer, setTimer] = useState<number | undefined>(undefined);
	
	const textAreaStyles: CSSProperties = useMemo(() => ({
		fontWeight: bold && "bold" || undefined,
		fontStyle: italic && "italic" || undefined,
	}), [bold, italic]);

	const onTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		const text = e.target.value;

		// Прерываем выполнение предыдущего таймера
		clearTimeout(timer);

		// Устанавливаем таймер, который запушит в историю 
		setTimer(
			setTimeout(() => {
				dispatch(historyPush({ text }));
			}, TEXT_EDITOR_HISTORY_TIMEOUT)
		);
		
		dispatch(setText(text));
	};

    return (
		<textarea
            className="editor-textarea"
            rows={5}
            cols={100}
            style={textAreaStyles}
            onChange={onTextChange}
            value={text} />
    );
};

export default memo(EditorTextArea);