"use client";

import { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  files: [],
  isLoading: false,
  error: null,
};

// Action types
const VTT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  ADD_FILES: "ADD_FILES",
  DELETE_FILE: "DELETE_FILE",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  CLEAR_ALL_FILES: "CLEAR_ALL_FILES",
};

// Reducer function
function vttFilesReducer(state, action) {
  switch (action.type) {
    case VTT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case VTT_ACTIONS.ADD_FILES:
      const newFiles = action.payload.map((file) => ({
        id: Date.now() + Math.random(),
        fileName: file.name || file.fileName,
        fileSize: file.size || file.fileSize || 0,
        uploadedDate: new Date(),
        status: "processed",
        type: "text/vtt",
        ...file,
      }));
      return {
        ...state,
        files: [...state.files, ...newFiles],
        error: null,
      };

    case VTT_ACTIONS.DELETE_FILE:
      return {
        ...state,
        files: state.files.filter((file) => file.id !== action.payload),
      };

    case VTT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case VTT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case VTT_ACTIONS.CLEAR_ALL_FILES:
      return {
        ...state,
        files: [],
      };

    default:
      return state;
  }
}

// Create context
const VttFilesContext = createContext();

// Provider component
export function VttFilesProvider({ children }) {
  const [state, dispatch] = useReducer(vttFilesReducer, initialState);

  // Actions
  const addFiles = (files) => {
    dispatch({ type: VTT_ACTIONS.ADD_FILES, payload: files });
  };

  const deleteFile = (fileId) => {
    dispatch({ type: VTT_ACTIONS.DELETE_FILE, payload: fileId });
  };

  const setLoading = (loading) => {
    dispatch({ type: VTT_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: VTT_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: VTT_ACTIONS.CLEAR_ERROR });
  };

  const clearAllFiles = () => {
    dispatch({ type: VTT_ACTIONS.CLEAR_ALL_FILES });
  };

  // Helper functions
  const getFileById = (fileId) => {
    return state.files.find((file) => file.id === fileId);
  };

  const getTotalFiles = () => {
    return state.files.length;
  };

  const getTotalSize = () => {
    return state.files.reduce((total, file) => total + (file.fileSize || 0), 0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const value = {
    // State
    files: state.files,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    addFiles,
    deleteFile,
    setLoading,
    setError,
    clearError,
    clearAllFiles,
    
    // Helper functions
    getFileById,
    getTotalFiles,
    getTotalSize,
    formatFileSize,
  };

  return (
    <VttFilesContext.Provider value={value}>
      {children}
    </VttFilesContext.Provider>
  );
}

// Custom hook to use the context
export function useVttFiles() {
  const context = useContext(VttFilesContext);
  if (!context) {
    throw new Error("useVttFiles must be used within a VttFilesProvider");
  }
  return context;
}

export { VTT_ACTIONS };
