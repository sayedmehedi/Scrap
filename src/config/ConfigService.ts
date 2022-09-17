import {injectable} from "inversify";
import {
  REACT_APP_API_BASE_URL,
  REACT_APP_MEDIA_BASE_URL,
  REACT_APP_EXPORT_BASE_URL,
  REACT_APP_METALS_API_TOKEN,
  REACT_APP_METALS_API_BASE_URL,
  REACT_APP_DEEP_LINKING_PREFIXES,
} from "react-native-dotenv";

@injectable()
export class ConfigService {
  public get apiBaseURL(): string {
    return REACT_APP_API_BASE_URL;
  }

  public get metalsApiBaseUrl(): string {
    return REACT_APP_METALS_API_BASE_URL;
  }

  public get metalsApiToken(): string {
    return REACT_APP_METALS_API_TOKEN;
  }

  public get mediaBaseUrl(): string {
    return REACT_APP_MEDIA_BASE_URL;
  }

  public get exportBaseUrl(): string {
    return REACT_APP_EXPORT_BASE_URL;
  }

  public get contentType(): string {
    return "application/json";
  }

  public get accept(): string {
    return "application/json";
  }

  public get appDeepLinkPrefixes(): string[] {
    return REACT_APP_DEEP_LINKING_PREFIXES;
  }
}
