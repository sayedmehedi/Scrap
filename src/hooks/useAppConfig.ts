import {container} from '@src/appEngine';
import {ConfigService} from '@config/ConfigService';

const configService = container.get<ConfigService>(ConfigService);

export default function useAppConfig() {
  return configService;
}
