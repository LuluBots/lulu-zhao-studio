import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {existsSync} from 'node:fs';
const wrangler=process.env.WRANGLER_BIN ?? [path.resolve('node_modules/.bin/wrangler'),path.resolve('../../node_modules/.bin/wrangler')].find(existsSync);
if(!wrangler)throw new Error('Install Wrangler or set WRANGLER_BIN to its executable path.');
function count(prefix){const result=execFileSync(wrangler,['kv','key','list','--namespace-id','33ddf9dc37bc47d3b345d28e79ea0496','--remote','--prefix',prefix],{encoding:'utf8'});return JSON.parse(result).length}
const day=process.argv[2]??new Date().toISOString().slice(0,10);
if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw new Error('Use YYYY-MM-DD');
console.log(`Total anonymous browsers: ${count('visitor:')}`);
console.log(`${day} (UTC): ${count('day:'+day+':')} browsers`);
