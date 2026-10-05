export const TASK_STATUSES = ['Pendente', 'Em andamento', 'Concluída'];

export function validateTask(values) {
  const errors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  if (!title) errors.title = 'Informe o título.';
  else if (title.length > 100) errors.title = 'Use até 100 caracteres.';
  if (!description) errors.description = 'Informe a descrição.';
  else if (description.length > 1000) errors.description = 'Use até 1000 caracteres.';
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(values.date.trim());
  if (!match) {
    errors.date = 'Use o formato DD/MM/AAAA.';
  } else {
    const [, day, month, year] = match.map(Number);
    const date = new Date(year, month - 1, day);
    if (year < 2000 || year > 2100 || date.getFullYear() !== year ||
      date.getMonth() !== month - 1 || date.getDate() !== day) {
      errors.date = 'Informe uma data válida entre 2000 e 2100.';
    }
  }
  if (!TASK_STATUSES.includes(values.status.trim())) {
    errors.status = 'Use Pendente, Em andamento ou Concluída.';
  }
  return errors;
}

