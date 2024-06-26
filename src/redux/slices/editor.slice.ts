import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { clamp } from "../../utils/clamp";
import { TEXT_EDITOR_HISTORY_MAX, TEXT_EDITOR_STORAGE_KEY } from "../../constants";
import { HistoryRecordType } from "../../types/historyRecord.type";

export interface EditorState {
    text: string;
    history: HistoryRecordType[];
    historyActiveIndex?: number;
}

const initialState: EditorState = {
    text: "",
    history: [],
    historyActiveIndex: undefined,
};

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setText: (state, { payload }: PayloadAction<string>) => {
            state.text = payload;
            localStorage.setItem(TEXT_EDITOR_STORAGE_KEY, payload);
        },
        historyPush: (state, { payload }: PayloadAction<Partial<HistoryRecordType>> ) => {
            const length = state.history.length - 1;

            // Удаляем первый элемент, если достигли максимума
            if ( length >= TEXT_EDITOR_HISTORY_MAX ) {
                state.history.shift();
            }
            
            const index = state.historyActiveIndex;
            
            if ( !index && ( payload.bold !== undefined || payload.italic !== undefined ) ) {
                return;
            }
            
            // Перезаписываем историю
            if ( index !== undefined && index < length ) {
                state.history = state.history.slice(0, index + 1);
            }
            const history = state.history;
            const lastRec = history[history.length - 1];

            state.history.push({ ...lastRec, ...payload });
            
            if ( index === undefined ) {
                state.historyActiveIndex = 0;
            }
            else {
                state.historyActiveIndex! += 1;
            }
        },
        historyUndo: (state) => {
            const index = state.historyActiveIndex;
            if ( index === undefined ) return;

            if ( index == 0 ) {
                state.historyActiveIndex = undefined;
                state.text = "";
                
                localStorage.setItem(TEXT_EDITOR_STORAGE_KEY, "");
                return;
            }

            const newIndex = clamp(index - 1, 0, state.history.length);
            const rec = state.history[newIndex];
        
            state.historyActiveIndex = newIndex;
            state.text = rec.text;
            
            localStorage.setItem(TEXT_EDITOR_STORAGE_KEY, rec.text);
        },
        historyRedo: (state) => {
            const index = state.historyActiveIndex ?? -1;
            const length = state.history.length - 1;
            if ( index >= length ) return;
            
            const newIndex = clamp(index + 1, 0, length);
            const rec = state.history[newIndex];

            if ( !rec ) return;

            state.historyActiveIndex = newIndex;
            state.text = rec.text;
            localStorage.setItem(TEXT_EDITOR_STORAGE_KEY, rec.text);
        },
        loadTextFromLocalStorage: (state) => {
            const text = localStorage.getItem(TEXT_EDITOR_STORAGE_KEY);

            if ( text ) {
                state.text = text;
                state.history = [{ text, bold: false, italic: false }];
                state.historyActiveIndex = 0;
            }
        },
    },
});

export const { setText, historyPush, historyRedo, historyUndo, loadTextFromLocalStorage } = editorSlice.actions;

export const textSelector = (state: RootState) => state.text;
export const historySelector = (state: RootState) => state.history;
export const historyActiveIndexSelector = (state: RootState) => state.historyActiveIndex;

export default editorSlice.reducer;