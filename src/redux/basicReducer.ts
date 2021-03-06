import { InitialStateType, CardType, ColumnType, BoardType } from "../models";
import {
  ADD_BOARD,
  DELETE_BOARD,
  RENAME_BOARD,
  SET_CURRENT_BOARD,
  ADD_COLUMN,
  RENAME_COLUMN,
  DELETE_COLUMN,
  ADD_CARD,
  RENAME_CARD,
  DELETE_CARD,
  MOVE_CARD,
} from "./basic/types";
import concat from "lodash/concat";
import filter from "lodash/filter";
import { getRandomInt } from "../utils";

const generateId = () => getRandomInt(100, 999);

let initialState: InitialStateType = {
  boards: [],
  columns: [],
  cards: [],
  currentBoard: 0,
};

type ActionType = {
  type: string;
  payload: any;
};

export const basic = (
  state: InitialStateType = initialState,
  { type, payload }: ActionType
): InitialStateType => {
  switch (type) {
    case ADD_BOARD:
      const { title } = payload;
      const newBoard: BoardType = {
        id: generateId(),
        title,
      };
      return {
        ...state,
        boards: concat(state.boards, newBoard),
      };

    case RENAME_BOARD:
      const boardsCopy = concat([], state.boards);
      const { id, newTitle } = payload;
      const index = boardsCopy.findIndex((item) => item.id === id);
      boardsCopy[index] = {
        id,
        title: newTitle,
      };
      return {
        ...state,
        boards: boardsCopy,
      };

    case DELETE_BOARD:
      const { id: idToDelete } = payload;
      return {
        ...state,
        cards: filter(state.cards, (b) => b.boardId !== idToDelete),
        boards: filter(state.boards, (b) => b.id !== idToDelete),
        columns: filter(state.columns, (b) => b.boardId !== idToDelete),
      };

    case SET_CURRENT_BOARD:
      const { id: currentBoardId } = payload;
      return {
        ...state,
        currentBoard: currentBoardId,
      };

    case ADD_COLUMN:
      const { title: colTitle } = payload;
      const newCol: ColumnType = {
        id: generateId(),
        boardId: state.currentBoard,
        title: colTitle,
      };
      return {
        ...state,
        columns: concat(state.columns, newCol),
      };

    case RENAME_COLUMN:
      const { newTitle: newColTitle, id: colId } = payload;
      const columnsCopy = concat([], state.columns);
      const colIndex = columnsCopy.findIndex((item) => item.id === colId);
      columnsCopy[colIndex] = {
        title: newColTitle,
        id: colId,
        boardId: state.currentBoard,
      };

      return {
        ...state,
        columns: columnsCopy,
      };

    case DELETE_COLUMN:
      const { id: colToDelete } = payload;

      return {
        ...state,
        columns: filter(state.columns, (col) => col.id !== colToDelete),
        cards: filter(state.cards, (card) => card.colId !== colToDelete),
      };

    case ADD_CARD:
      const { columnId: cardColId, title: cardTitle } = payload;
      const newCard: CardType = {
        id: generateId(),
        colId: cardColId,
        boardId: state.currentBoard,
        title: cardTitle,
      };

      return {
        ...state,
        cards: [...state.cards, newCard],
      };

    case RENAME_CARD:
      const { id: cardId, newTitle: cardNewTitle } = payload;
      const cardsCopy = concat([], state.cards);
      const cardIndex = cardsCopy.findIndex((item) => item.id === cardId);
      const cardColIndex = cardsCopy[cardIndex].colId;
      cardsCopy[cardIndex] = {
        id: cardId,
        title: cardNewTitle,
        boardId: state.currentBoard,
        colId: cardColIndex,
      };

      return {
        ...state,
        cards: cardsCopy,
      };

    case DELETE_CARD:
      const { id: cardToDelete } = payload;
      return {
        ...state,
        cards: filter(state.cards, (card) => card.id !== cardToDelete),
      };

    case MOVE_CARD:
      const { cardId: cardMovedId, targetColId } = payload
      const cardItems = [...state.cards]
      const movedCardIndex = cardItems.findIndex( card => card.id === cardMovedId) 
      const movedCard = cardItems[movedCardIndex]
      cardItems[movedCardIndex] = {
        id: cardMovedId,
        colId: targetColId,
        title: movedCard.title,
        boardId: state.currentBoard
      }

      return {
        ...state,
        cards: cardItems
      }

    default:
      return state;
  }
};
