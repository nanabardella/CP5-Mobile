const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { pathToFileURL } = require('node:url');

const source = readFileSync(new URL('../src/utils/taskValidation.js', pathToFileURL(__filename)), 'utf8');
const validation = import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const valid = { title: 'Estudar', description: 'Revisar Firestore', date: '05/10/2026', status: 'Pendente' };

test('aceita os três status e datas válidas, incluindo ano bissexto', async () => {
  const { validateTask, TASK_STATUSES } = await validation;
  for (const status of TASK_STATUSES) assert.deepEqual(validateTask({ ...valid, status }), {});
  assert.deepEqual(validateTask({ ...valid, date: '29/02/2028' }), {});
});

test('rejeita campos vazios e espaços em branco nos quatro inputs', async () => {
  const { validateTask } = await validation;
  for (const field of Object.keys(valid)) {
    assert.ok(validateTask({ ...valid, [field]: '   ' })[field], field);
  }
});

test('rejeita datas inexistentes, formato incorreto e anos fora do intervalo', async () => {
  const { validateTask } = await validation;
  for (const date of ['31/02/2026', '29/02/2027', '31/04/2026', '00/10/2026', '01/13/2026', '2026-10-05', '5/10/2026', '01/01/1999', '01/01/2101']) {
    assert.ok(validateTask({ ...valid, date }).date, date);
  }
});

test('valida limites de texto e recusa status desconhecido', async () => {
  const { validateTask } = await validation;
  assert.deepEqual(validateTask({ ...valid, title: 'a'.repeat(100), description: 'a'.repeat(1000) }), {});
  assert.ok(validateTask({ ...valid, title: 'a'.repeat(101) }).title);
  assert.ok(validateTask({ ...valid, description: 'a'.repeat(1001) }).description);
  assert.ok(validateTask({ ...valid, status: 'Qualquer status' }).status);
});
