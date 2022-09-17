import {Container} from "inversify";
import axios, {AxiosInstance} from "axios";
import {ConfigService} from "@config/ConfigService";
import {ApplicationError} from "@core/domain/ApplicationError";
import {ServiceProviderTypes} from "@core/serviceProviderTypes";

export default function registerHttpClient(container: Container) {
  container
    .bind<AxiosInstance>(ServiceProviderTypes.HttpClient)
    .toDynamicValue(context => {
      const config = context.container.get(ConfigService);
      const baseURL = config.apiBaseURL;

      const apiHttpClient = axios.create({
        baseURL,
        headers: {
          Accept: config.accept,
          "Content-Type": config.contentType,
        },
      });

      apiHttpClient.interceptors.response.use(
        function (response) {
          return response;
        },
        function (error) {
          const applicationError = new ApplicationError(error);
          return Promise.reject(applicationError);
        },
      );
      return apiHttpClient;
    })
    .inSingletonScope();

  container
    .bind<AxiosInstance>(ServiceProviderTypes.MetalsApiClient)
    .toDynamicValue(context => {
      const config = context.container.get(ConfigService);
      const baseURL = config.metalsApiBaseUrl;
      const accessKey = config.metalsApiToken;

      const apiHttpClient = axios.create({
        baseURL,
        headers: {
          Accept: config.accept,
          "Content-Type": config.contentType,
        },
        params: {
          access_key: accessKey,
        },
      });

      return apiHttpClient;
    })
    .inSingletonScope();
}
