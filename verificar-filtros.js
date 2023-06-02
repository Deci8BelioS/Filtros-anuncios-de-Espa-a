const fs = require('fs');

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, 'utf8', (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const removeDuplicateFilters = (filters) => {
  const uniqueFilters = [];
  const filterRegex = /^(?!!)(.*)$/gm;

  let match;

  while ((match = filterRegex.exec(filters)) !== null) {
    const filter = match[1];

    if (filter !== undefined && filter.trim() !== '') {
      if (!uniqueFilters.includes(filter.trim())) {
        uniqueFilters.push(filter.trim());
      }
    }
  }

  return uniqueFilters.join('\n');
};

(async () => {
  try {
    const filters = await readFile('filtro.txt');
    const uniqueFilters = removeDuplicateFilters(filters);
    const date = new Date().toISOString().split('T')[0];
    const filterCount = uniqueFilters.split('\n').length;
    const header = [
      '!',
      `! Homepage: https://github.com/Deci8BelioS/Filtros-anuncios-de-Espana-y-mas`,
      `! Title: Filtros anuncios de España y mas por DeciBelioS`,
      `! Description: Filtros de publicidad y elementos molestos para las extensiones uBlock Origin y AdGuard para paginas Españolas y mas (ejemplo: genbeta, xataka, motorpasion, reddit etc...) por DeciBelioS`,
      `! Filtros creados el: ${date}`,
      `! Total de filtros: ${filterCount}`,
      `! License GPL-3.0: https://github.com/Deci8BelioS/Filtros-anuncios-de-Espana-y-mas/blob/main/LICENSE.md`,
      `! License CC-BY-3.0: https://github.com/Deci8BelioS/Filtros-anuncios-de-Espana-y-mas/blob/main/LICENSE-.md`,
      `!------ [Reglas genericas de bloqueo de publicidad] / general blocking ------!`,
      '!',
    ].join('\n');

    const finalContent = `${header}\n\n${uniqueFilters}`;
    await writeFile('filtros-unicos.txt', finalContent);
    console.log('Filtros únicos generados en filtros-unicos.txt');
  } catch (error) {
    console.error('Error al procesar los filtros:', error);
    process.exit(1);
  }
})();
