import { memo } from "react";
import { useAppDispatch } from "../../redux";
import { historyPush, historyRedo, historyUndo } from "../../redux/slices/editor.slice";

interface EditorButtonsProps {
    bold: boolean;
    italic: boolean;
}

const EditorButtons = (props: EditorButtonsProps) => {
    const { bold, italic } = props;

	const dispatch = useAppDispatch();

	const onUndoClick = () => {
		dispatch(historyUndo());
	};
	const onRedoClick = () => {
		dispatch(historyRedo());
	};

	const onBoldClick = () => {
		dispatch(historyPush({ bold: !bold}));
	};
	const onItalicClick = () => {
		dispatch(historyPush({ italic: !italic }));
	};

    return (
		<div className="editor-bottom">
            <button onClick={onUndoClick}>Undo</button>
            <button onClick={onRedoClick}>Redo</button>
            <button onClick={onBoldClick}>Bold</button>
            <button onClick={onItalicClick}>Italic</button>
        </div>
    );
};

export default memo(EditorButtons);