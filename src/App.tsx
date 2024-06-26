import { useEffect} from "react";
import { useAppDispatch, useAppSelector } from "./redux";
import { historyActiveIndexSelector, historySelector, loadTextFromLocalStorage } from "./redux/slices/editor.slice";
import EditorButtons from "./components/EditorButtons";
import EditorTextArea from "./components/EditorTextArea";
import "./App.css";
import EditorHistory from "./components/EditorHistory";

const App = () => {
	const dispatch = useAppDispatch();
	const history = useAppSelector(historySelector);
	const historyActiveIndex = useAppSelector(historyActiveIndexSelector);

	const lastRec = history[historyActiveIndex ?? 0];
	const bold = lastRec?.bold;
	const italic = lastRec?.italic;

	// Загружаем данные из localStorage при монтировании
	useEffect(() => {
		dispatch(loadTextFromLocalStorage());
	}, []);

	return (
		<div className="editor-container">
			<div className="editor-top">
				<EditorTextArea bold={bold} italic={italic} />
				<EditorHistory history={history} activeIndex={historyActiveIndex} />
			</div>
			<EditorButtons bold={bold} italic={italic} />
		</div>
	);
};

export default App;
