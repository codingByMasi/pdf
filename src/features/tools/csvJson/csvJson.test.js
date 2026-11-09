// Tests for CSV and JSON conversion.
import { describe, expect, it } from 'vitest';
import { csvToJson, jsonToCsv } from './csvJson.js';

describe('csvJson', () => {
  it('turns CSV into objects', () => {
    const r = csvToJson('name,age\nAsha,30\n"Ravi, K",25', 0);
    expect(JSON.parse(r.text)).toEqual([{ name: 'Asha', age: '30' }, { name: 'Ravi, K', age: '25' }]);
  });
  it('turns objects into CSV with quotes', () => {
    const r = jsonToCsv('[{"a":"x,y","b":2},{"a":"z","c":"q\\"r"}]');
    expect(r.text).toBe('a,b,c\n"x,y",2,\nz,,"q""r"');
  });
  it('handles lists of lists', () => {
    expect(jsonToCsv('[[1,2],[3,4]]').text).toBe('1,2\n3,4');
  });
  it('says what is wrong', () => {
    expect(jsonToCsv('nope').errorKey).toBe('csvjson.badJson');
    expect(jsonToCsv('{"a":1}').errorKey).toBe('csvjson.notList');
    expect(csvToJson('').errorKey).toBe('csvjson.empty');
  });
});
