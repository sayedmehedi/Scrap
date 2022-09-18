import axios, {AxiosError} from "axios";
import {
  ServerErrorType,
  ServerNonFieldError,
  ServerValidationError,
} from "@src/types";

export class ApplicationError extends Error {
  constructor(private readonly data: AxiosError<ServerErrorType>) {
    console.log("staaaaaatus", data.status);
    super(data.message);
  }

  get response() {
    return this.data.response;
  }

  get request() {
    return this.data.request;
  }

  get field_errors(): Record<string, string> {
    console.log("isValidationError", this.isValidationError());
    if (this.isValidationError()) {
      const validationError = this.response!.data as ServerValidationError;

      return Object.entries(
        validationError.errors ?? validationError.error!,
      ).reduce((acc, [fieldName, [errorMessage]]) => {
        acc[fieldName] = errorMessage;
        return acc;
      }, {} as Record<string, string>);
    }

    return {};
  }

  get status() {
    if (this.response) {
      return this.response.status;
    }

    return 0;
  }

  get non_field_error(): string {
    if (this.response?.data) {
      const nonFieldError = this.response.data as ServerNonFieldError;

      if (!!nonFieldError.error) {
        return nonFieldError.error;
      }
    }

    if (this.isValidationError()) {
      return "Invalid data";
    }

    if (this.isUnauthorizedError()) {
      return "You need to log in first.";
    }

    return this.message;
  }

  isNotFoundError(): boolean {
    return this.status === 404;
  }

  isValidationError(): boolean {
    return this.status === 422;
  }

  isUnauthorizedError() {
    return this.status === 401;
  }

  isRequestCancellationError() {
    return axios.isCancel(this.data);
  }

  getFormattedMessage<TKey extends string = string>(): {
    non_field_error: string;
    field_errors: Record<TKey, string>;
  } {
    return {
      field_errors: this.field_errors as Record<TKey, string>,
      non_field_error: this.non_field_error,
    };
  }
}
