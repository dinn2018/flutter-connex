import { Framework } from '@vechain/connex-framework';
import { FlutterDriver } from './flutter-driver';
Object.defineProperty(window, 'connex', { value: new Framework(new FlutterDriver()), enumerable: true });