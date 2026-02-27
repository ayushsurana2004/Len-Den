import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('ts-node/esm', pathToFileURL('./'));

try {
    await import('./src/index.ts');
} catch (err) {
    console.error('🔥 CRASH DETECTED:');
    console.error(err);
    if (err.stack) console.error(err.stack);
    process.exit(1);
}
