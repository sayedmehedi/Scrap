import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {FieldValues, UseFormSetError} from "react-hook-form";
import {JoteyQueryError, ServerValidationError} from "@src/types";
import {NativeModuleError} from "@react-native-google-signin/google-signin";

export function addServerErrors<T extends FieldValues>(
  errors: {[P in keyof T]: string} | Record<keyof T, string>,
  setError: UseFormSetError<T>,
) {
  return Object.keys(errors).forEach(key => {
    setError(key as any, {
      type: "server",
      message: errors[key as keyof T]!,
    });
  });
}

/**
 * Type predicate to narrow an unknown error to `FetchBaseQueryError`
 */
export function isFetchBaseQueryError(
  error: unknown,
): error is FetchBaseQueryError {
  return typeof error === "object" && error != null && "status" in error;
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'message' property
 */
export function isErrorWithMessage(error: unknown): error is {message: string} {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as Error).message === "string"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'exception' property
 */
export function isErrorWithException(
  error: unknown,
): error is {exception: string} {
  return (
    typeof error === "object" &&
    error != null &&
    "exception" in error &&
    typeof (error as any).exception === "string"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'error' property
 */
export function isErrorWithError(error: unknown): error is {error: string} {
  return (
    typeof error === "object" &&
    error != null &&
    "error" in error &&
    typeof (error as any).error === "string"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'errors' property
 */
export function isErrorWithErrors(error: unknown): error is {errors: string} {
  return (
    typeof error === "object" &&
    error != null &&
    "errors" in error &&
    typeof (error as any).errors === "string"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'suggestion' property
 */
export function isErrorWithSuggestion(
  error: unknown,
): error is {suggestion: string} {
  return (
    typeof error === "object" &&
    error != null &&
    "suggestion" in error &&
    typeof (error as any).suggestion === "string"
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'errors' property
 */
export function isValidationError(
  error: unknown,
): error is ServerValidationError {
  return (
    (typeof error === "object" &&
      error != null &&
      "errors" in error &&
      typeof (error as any).errors === "object") ||
    (typeof error === "object" &&
      error != null &&
      "error" in error &&
      typeof (error as any).error === "object")
  );
}

/**
 * Type predicate to narrow an unknown error to an object with a string 'errors' property
 */
export function isJoteyQueryError(error: unknown): error is JoteyQueryError {
  return (
    typeof error === "object" &&
    error != null &&
    "data" in error &&
    typeof (error as any).data.field_errors === "object"
  );
}

export function isNativeModuleError(
  error: unknown,
): error is NativeModuleError {
  return !!error && typeof error === "object" && "code" in error;
}
